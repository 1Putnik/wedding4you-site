document.querySelectorAll('.review-form').forEach(form=>{
 const ru=document.documentElement.lang==='ru';
 const picker=form.querySelector('.avatar-picker');
 picker?.addEventListener('change',()=>{
  const n=Number(form.elements.avatar.value);
  picker.querySelector('.avatar-current').className=`review-portrait portrait-${n-1} avatar-current`;
  picker.querySelector('.avatar-selection').textContent=(ru?'Аватар ':'אווטאר ')+n;
 });
 picker?.querySelector('.avatar-done').addEventListener('click',()=>{picker.open=false;picker.querySelector('summary').focus();});
 form.addEventListener('submit',event=>{
  event.preventDefault();
  const ru=document.documentElement.lang==='ru';
  const name=form.elements.name.value.trim(),review=form.elements.review.value.trim();
  const status=form.querySelector('.review-form-status');
  if(!name || review.length<20 || !form.elements.consent.checked){status.textContent=ru?'Укажите имя, отзыв не короче 20 символов и согласие на публикацию.':'יש למלא שם, המלצה באורך 20 תווים לפחות ואישור פרסום.';return;}
  const avatar=Number(form.elements.avatar?.value||1);
  if(!Number.isInteger(avatar)||avatar<1||avatar>20)return;
  const text=ru?`Отзыв для Wedding4You\nИмя для публикации: ${name}\nАватар: cartoon-v2-${avatar}\n\n${review}\n\nРазрешаю публикацию отзыва под указанным именем и с выбранным аватаром.`:`המלצה ל־Wedding4You\nשם לפרסום: ${name}\nאווטאר: cartoon-v2-${avatar}\n\n${review}\n\nאני מאשר/ת לפרסם את ההמלצה בשם שציינתי ועם האווטאר שבחרתי.`;
  const link=document.createElement('a');link.href='https://wa.me/972504459794?text='+encodeURIComponent(text);link.target='_blank';link.rel='noopener noreferrer';link.textContent=ru?'Открыть WhatsApp с отзывом':'פתיחת WhatsApp עם ההמלצה';
  status.replaceChildren(document.createTextNode(ru?'Отзыв ещё не отправлен. Завершите отправку в WhatsApp. ':'ההמלצה עדיין לא נשלחה. יש להשלים את השליחה ב־WhatsApp. '),link);
  link.click();
 });
});
