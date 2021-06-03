const alertBox = document.getElementById('alert-box')
const imgBox = document.getElementById('img-box')
const form = document.getElementById('p-form')

const image = document.getElementById('id_image')
const name = document.getElementById('id_name')
const description = document.getElementById('id_description')

const btnBox = document.getElementById('btn-box')

const csrf = document.getElementsByName('csrfmiddlewaretoken')

const urlFix = window.location.href + `media/`

const btns = [...btnBox.children]
const url = ''

const handlAlerts=(type, text)=>{
    alertBox.innerHTML = `<div class='alert alert-${type}' role='alert'>
        ${text}></div>`
}

image.addEventListener('change', ()=>{
    const img_data = image.files[0]
    const url = URL.createObjectURL(img_data)
    imgBox.innerHTML = `<img src='${url}' width='50%'>`
    btnBox.classList.remove('not-visible')
})


let filter = null
btns.forEach(btn=>btn.addEventListener('click', ()=>{
    filter = btn.getAttribute('data-filter')
}))



let id = null
form.addEventListener('submit', (e)=>{
    e.preventDefault();

    const fd = new FormData()

    fd.append('csrfmiddlewaretoken', csrf[0].value)
    fd.append('image', image.files[0])
    fd.append('name', name.value)
    fd.append('description', description.value)
    fd.append('actio', filter)
    fd.append('id', id)

    $.ajax({
        type: 'POST',
        enctype: 'multipart/form-data',
        data: fd,
        url: url,

        success: function (resp){
            const data = JSON.parse(resp.data)


            imgBox.innerHTML = `<img src='${urlFix + data[0].fields.image}' width='50%'>`
            const sText = `Successfully saved.. ${data[0].fields.name}`

            handlAlerts('success', sText)
            setTimeout(()=>{
                    alertBox.innerHTML = ''
            }, 3000)
        },
        error: function (error){
            // console.log(error)
            alertBox.innerHTML = `Something went wrong...`
        },
        cache: false,
        contentType: false,
        processData: false
    })
})