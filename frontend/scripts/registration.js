function view_Permit(){
    var view_permit = document.getElementById('view_permit')
    view_permit.classList.remove('hidden')

    var content_container = document.getElementById('content_container')
    content_container.classList.add('blur-lg')
}

function close_Img(){
    var close_permit = document.getElementById('view_permit')
    close_permit.classList.add('hidden')

    var content_container = document.getElementById('content_container')
    content_container.classList.remove('blur-lg')
}