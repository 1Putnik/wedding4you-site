(() => {
  const captions = [
    "טקס אונליין מהסלון, עם עורך הטקס על המסך",
    "רגע החופה בבית, מול מסך גדול עם עורך הטקס",
    "זוג אומר כן מהבית, כשעורך הטקס מצטרף מרחוק",
    "טקס מקוון בפינת ישיבה ביתית, עם משפחה שמצטרפת",
    "מחליפים טבעות בבית, מול עורך טקס ביוטה על המסך",
    "חתונה מהבית עם עדים קרובים ועורך טקס בשיחת וידאו",
    "חוגגים באולם מול מסך גדול, ועורך הטקס משתתף מרחוק",
    "טקס אונליין באולם אירועים, עם עורך הטקס על המסך",
    "משפחה וחברים באולם צופים בטקס שמנחה עורך הטקס מרחוק",
    "רגע החופה באולם, בשיחת וידאו עם עורך טקס ביוטה",
    "זוג נישא באולם חגיגי, ועורך הטקס מצטרף על מסך גדול",
    "טקס מקוון בשולחן חגיגי, עם עורך הטקס והעדים בשיחה",
    "שני חתנים עורכים טקס אונליין, עם עורך הטקס על המסך",
    "שני חתנים מחליפים טבעות מול עורך הטקס בשיחת וידאו",
    "טקס חתונה מהבית לשני חתנים, עם עורך טקס ביוטה",
    "שני חתנים אומרים כן, ועורך הטקס משתתף מרחוק",
    "רגע חגיגי לשני חתנים מול מסך גדול ועורך הטקס",
    "שני חתנים עם העדים, בטקס אונליין בהנחיית עורך הטקס",
    "שתי כלות עורכות טקס אונליין, עם עורך הטקס על המסך",
    "שתי כלות מחליפות טבעות מול עורך הטקס בשיחת וידאו",
    "טקס חתונה מהבית לשתי כלות, עם עורך טקס ביוטה",
    "שתי כלות אומרות כן, ועורך הטקס משתתף מרחוק",
    "רגע חגיגי לשתי כלות מול מסך גדול ועורך הטקס",
    "שתי כלות עם העדים, בטקס אונליין בהנחיית עורך הטקס",
    "בני משפחה מצטרפים מרחוק לטקס של זוג אונליין",
    "עדים ומשפחה צופים בטקס וידאו לצד הזוג",
    "קרובים מעבר לים משתתפים בשיחת החתונה",
    "הזוג והעדים בבית, והמשפחה מצטרפת ממסכים",
    "טקס אונליין משותף עם משפחה וחברים בשיחת וידאו",
    "רגע החתונה באווירה אישית, עם עורך הטקס על המסך"
  ];

  const section = document.querySelector(".photo-editorial[data-gallery]");
  if (!section) return;

  const order = (section.dataset.order || "").split(",").map(Number).filter(n => n >= 1 && n <= 30);
  const track = section.querySelector(".gallery-track");
  const count = section.querySelector(".gallery-count");
  const previous = section.querySelector("[data-gallery-prev]");
  const next = section.querySelector("[data-gallery-next]");
  const status = section.querySelector(".gallery-status");
  const slides = order.map((number, position) => {
    const slide = document.createElement("figure");
    slide.className = "gallery-slide";
    slide.setAttribute("role", "group");
    slide.setAttribute("aria-roledescription", "שקופית");
    slide.setAttribute("aria-label", `תמונה ${position + 1} מתוך ${order.length}`);
    const image = document.createElement("img");
    image.src = `assets/gallery/scene-${String(number).padStart(2, "0")}.webp`;
    image.width = 1024;
    image.height = 1024;
    image.loading = "lazy";
    image.decoding = "async";
    image.alt = captions[number - 1];
    const caption = document.createElement("figcaption");
    caption.textContent = captions[number - 1];
    slide.append(image, caption);
    track.append(slide);
    return slide;
  });

  if (!slides.length) return;
  let activeIndex = 0;
  const setActive = index => {
    activeIndex = Math.max(0, Math.min(index, slides.length - 1));
    count.textContent = `${activeIndex + 1} / ${slides.length}`;
    status.textContent = `תמונה ${activeIndex + 1} מתוך ${slides.length}`;
    previous.disabled = activeIndex === 0;
    next.disabled = activeIndex === slides.length - 1;
  };
  const go = delta => {
    const target = Math.max(0, Math.min(activeIndex + delta, slides.length - 1));
    const slideRect = slides[target].getBoundingClientRect();
    const trackRect = track.getBoundingClientRect();
    const slideOffset = slideRect.left - trackRect.left;
    const centeredOffset = track.scrollLeft + slideOffset - (track.clientWidth - slideRect.width) / 2;
    const maxScroll = track.scrollWidth - track.clientWidth;
    track.scrollTo({
      left: Math.max(0, Math.min(centeredOffset, maxScroll)),
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth"
    });
    setActive(target);
  };

  previous.addEventListener("click", () => go(-1));
  next.addEventListener("click", () => go(1));
  track.addEventListener("keydown", event => {
    if (event.key === "ArrowLeft") { event.preventDefault(); go(-1); }
    if (event.key === "ArrowRight") { event.preventDefault(); go(1); }
  });
  let scrollFrame;
  track.addEventListener("scroll", () => {
    clearTimeout(scrollFrame);
    scrollFrame = setTimeout(() => {
      // The last slide cannot reach the viewport center when the track ends.
      // Treat the scroll boundary as the final slide, then measure the nearest
      // slide after smooth scrolling has settled to avoid button clicks drifting.
      if (track.scrollLeft + track.clientWidth >= track.scrollWidth - 2) {
        setActive(slides.length - 1);
        return;
      }
      const center = track.getBoundingClientRect().left + track.clientWidth / 2;
      let nearest = 0;
      let distance = Infinity;
      slides.forEach((slide, index) => {
        const rect = slide.getBoundingClientRect();
        const currentDistance = Math.abs(rect.left + rect.width / 2 - center);
        if (currentDistance < distance) { distance = currentDistance; nearest = index; }
      });
      setActive(nearest);
    }, 220);
  }, { passive: true });
  setActive(0);
})();
