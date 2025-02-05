// function attachQrCardButtonListerners(checkbox) {
 
//     const inputs = document.querySelectorAll('.digit-verif-card input');

//     inputs.forEach((input, index) => {
//         input.addEventListener('input', () => {
//             if(input.value && index < inputs.length-1){
//                 inputs[index+1].focus();
//             }
//             const allFilled = Array.from(inputs).every(input => input.value.length === 1);
//             if(allFilled)
//                 attachDvCardBtnListeners(cardContent, qrCard, digitVerifCard, allBtns, cardBtns, checkbox);
//             });

//     });
// }

// function checkDigits(cardContent) {
//     const inputDigits = document.querySelectorAll('.dv-container input');

//     const allFilled = Array.from(inputDigits).every(digitInput => digitInput.value);

//     if(!allFilled){
//         showNotification('Please fill all the required input value');
//         return false;
//     }
//     return true;
// }

 function setupDigitInputs1() {
    const inputs = document.querySelectorAll('.dv-container input');
    
    inputs.forEach((input, index) => {
        input.addEventListener('input', async function(e) {
            if (this.value.length === 1) {
                if (!/^\d+$/.test(this.value)){
                    this.value = '';
                    return ;
                }
                if (index < inputs.length - 1) {
                    inputs[index + 1].focus();
                }
            }
            const allFilled = Array.from(inputs).every(input => input.value.length === 1);
            if (allFilled){
                const inputs = document.querySelectorAll('.dv-container input');
                const code = Array.from(inputs).map(input => input.value).join('');
                if (!await first_fetchTwoFaVerify(code))
                    return;
                else{
                    localStorage.setItem('2faCompleted', true);
                    Router.go('/dashboard');
                }
                //fetch and check the response
            }
        });
        input.addEventListener('keydown', function(e) {
            if (e.key === 'Backspace' && !this.value && index > 0) {
                inputs[index - 1].focus();
            }
        });

        input.addEventListener('paste', function(e) {
            e.preventDefault();
            const pastedData = e.clipboardData.getData('text').trim();
            
            if (/^\d{6}$/.test(pastedData)) {
                inputs.forEach((input, i) => {
                    input.value = pastedData[i];
                });
                inputs[inputs.length - 1].focus();
            }
        });
    });
}
