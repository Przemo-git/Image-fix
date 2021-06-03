const alertBox = document.getElementById('alert-box')
const imgBox = document.getElementById('img-box')
const form = document.getElementById('p-form')

const name = document.getElementById('id_name')
const description = document.getElementById('id_description')
const image = document.getElementById('id_image')
const btnBox = document.getElementById('btn-box')
// trzeba przejąć children btnBox dlatego sprawdzam
console.log(btnBox.children)
// z konsoli wiadomo że to jest HTMLCollection

const btns = [...btnBox.children]

// poniewarz (patrz konsola zdjęcie miało dziwną nazwę typu:"images/images/ppp_oeBipOP.jpeg")
// to trzeba:
const mediaURL = window.location.href + 'media/'
console.log(mediaURL)
// i dzięki temu (konsola) mamy: http://127.0.0.1:8000/media/

const csrf = document.getElementsByName('csrfmiddlewaretoken')
console.log(csrf)

const url = ""

const handleAlerts = (type, text) =>{
    alertBox.innerHTML = `<div class="alert alert-${type}" role="alert">
                            ${text}
                        </div>`
}

image.addEventListener('change', ()=>{
    const img_data = image.files[0]                   //////////////////////////
    const url = URL.createObjectURL(img_data)
    console.log(url)
    imgBox.innerHTML = `<img src="${url}" width="50%">` /////////
    btnBox.classList.remove('not-visible')
})


let filter = null
btns.forEach(btn=>btn.addEventListener('click', ()=>{
    filter = btn.getAttribute('data-filter')
    console.log(filter)
}))



let id = null
form.addEventListener('submit', e=>{
    e.preventDefault()

    const fd = new FormData()
    fd.append('csrfmiddlewaretoken', csrf[0].value)
    fd.append('name', name.value)
    fd.append('description', description.value)
    fd.append('image', image.files[0])
    fd.append('action', filter)
    fd.append('id', id)

    $.ajax({
        type: 'POST',
        url: url,
        enctype: 'multipart/form-data',
        data: fd,
        success: function(response){
            const data = JSON.parse(response.data)
            console.log(response)
            // mamy string
            console.log(data)
            // i teraz mamy dane

            // Nie działa update bp mamy (konsola):
            // 0: {model: "photos.photo", pk: 14, fields: {…}}
            // chcemy żeby pk = id, dlatego:
            // id = data[0].pk
            imgBox.innerHTML = `<img src="${mediaURL + data[0].fields.image}" width="50%">`
            // I teraz mamy: image: "images/images/ppp_eVHOynP.jpeg"
            const sText = `successfully saved ${data[0].fields.name}`
            handleAlerts('success', sText)       //////////
            setTimeout(()=>{
                alertBox.innerHTML = ""
            }, 3000)
        },
        error: function(error){
            console.log(error)
            handleAlerts('danger', 'ups..something went wrong')   ///////
        },
        cache: false,
        contentType: false,
        processData: false,
    })
})

console.log(form)