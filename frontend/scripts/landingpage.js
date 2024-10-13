function view_trainerUI(){
    var view_trainerui = document.getElementById('trainerUI_showcase')
    view_trainerui.classList.remove('invisible')
}
function view_studentUI(){
    var view_studentui = document.getElementById('studentUI_showcase')
    view_studentui.classList.remove('invisible')
}


document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closePopup('trainerUI_showcase');
    }
});

function closePopup(UI_showcase) {
    if (UI_showcase === 'trainerUI_showcase') {
        const popup = document.getElementById('trainerUI_showcase');
        const popup2 = document.getElementById('studentUI_showcase');
        if (popup) {
            popup.classList.add('invisible'); // Ensure 'invisible' is defined in your CSS
            popup2.classList.add('invisible'); // Ensure 'invisible' is defined in your CSS
        }
    }
}