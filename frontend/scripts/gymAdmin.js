function modifyPending(){
    var modify_pending = document.getElementById('pending_card')
    var pending_modify_input = document.getElementById('pending_modify_input')
    var modify_text = document.getElementById('modify_text')
    modify_pending.classList.add('border-50')
    modify_pending.classList.add('border-b-2')
    modify_pending.classList.add('pb-10')
    pending_modify_input.classList.remove('hidden')
    modify_text.classList.remove('hidden')
}

function cancel_Modiy(){
    var modify_pending = document.getElementById('pending_card')
    var pending_modify_input = document.getElementById('pending_modify_input')
    var modify_text = document.getElementById('modify_text')
    modify_pending.classList.remove('border-50')
    modify_pending.classList.remove('border-b-2')
    modify_pending.classList.remove('pb-10')
    pending_modify_input.classList.add('hidden')
    modify_text.classList.add('hidden')
}