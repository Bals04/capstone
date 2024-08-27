function view_Pending(){
    var view_pending = document.getElementById('view_pending')
    view_pending.classList.remove('invisible')

    var content_container = document.getElementById('content_container')
    content_container.classList.add('blur-lg')
}

function close_Pending(){
    var close_pending = document.getElementById('view_pending')
    close_pending.classList.add('invisible')

    var content_container = document.getElementById('content_container')
    content_container.classList.remove('blur-lg')
}