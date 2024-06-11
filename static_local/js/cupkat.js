
  $(document).ready(function(){
      // Contact Form Handler
      var contactForm = $(".contact-form")
      var contactFormMethod = contactForm.attr("method")
      var contactFormEndpoint = contactForm.attr("action")
      function displaySubmitting(submitBtn, defaultText, doSubmit){
          if (doSubmit){
              submitBtn.addClass("disabled")
              submitBtn.html("<i class='fa fa-spin fa-spinner'></i> Enviando...")
          } else {
              submitBtn.removeClass("disabled")
              submitBtn.html(defaultText)
          }
      }
      contactForm.submit(function(event){
          event.preventDefault()
          const contactFormSubmitBtn = contactForm.find("[type='submit']")
          const contactFormSubmitBtnTxt = contactFormSubmitBtn.text()
          const contactFormData = contactForm.serialize()
          const thisForm = $(this)
          displaySubmitting(contactFormSubmitBtn, "", true)
          $.ajax({
              method: contactFormMethod,
              url: contactFormEndpoint,
              data: contactFormData,
              success: function(data){
                  contactForm[0].reset()
                  $.alert({
                      title: "Success!",
                      content: data.message,
                      theme: "modern",
                  })
                  setTimeout(function(){
                      displaySubmitting(contactFormSubmitBtn, contactFormSubmitBtnTxt, false)
                  }, 500)
              },
              error: function(error){
                  console.log(error.responseJSON)
                  const jsonData = error.responseJSON
                  let msg = ""
                  $.each(jsonData, function(key, value){
                      msg += key + ": " + value[0].message + "<br/>"
                  })
                  $.alert({
                      title: "Oops!",
                      content: msg,
                      theme: "modern",
                  })
                  setTimeout(function(){
                      displaySubmitting(contactFormSubmitBtn, contactFormSubmitBtnTxt, false)
                  }, 500)
          }
      })
  })

   // Auto Search
const searchForm = $(".search-form");
const searchInput = searchForm.find("[name='q']"); // input name='q'
const typingInterval = 500; // .5 seconds
const searchBtn = searchForm.find("[type='submit']");
const voiceSearchBtn = $("#voiceSearchBtn");

let typingTimer;

searchInput.keyup(function(event) {
  // key released
  clearTimeout(typingTimer);
  typingTimer = setTimeout(performSearch, typingInterval);
});

searchInput.keydown(function(event) {
  // key pressed
  clearTimeout(typingTimer);
});

voiceSearchBtn.on("click", function() {
  if (window.SpeechRecognition || window.webkitSpeechRecognition) {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.onstart = function() {
      console.log("Voice recognition started. Try speaking into the microphone.");
      voiceSearchBtn.html("<i class='fa fa-spinner fa-spin'></i>");
    };
    
    recognition.onspeechend = function() {
      console.log("Voice recognition ended.");
      recognition.stop();
      voiceSearchBtn.html("<i class='fa fa-microphone'></i>");
    };
    
    recognition.onresult = function(event) {
      const transcript = event.results[0][0].transcript;
      searchInput.val(transcript);
      performSearch();
    };
    
    recognition.start();
  } else {
    alert("Seu navegador não suporta reconhecimento de voz.");
  }
});

function displaySearching() {
  searchBtn.addClass("disabled");
  searchBtn.html("<i class='fa fa-spin fa-spinner'></i> Pesquisando...");
}

function performSearch() {
  displaySearching();
  const query = searchInput.val();
  setTimeout(function() {
    window.location.href = '/search/?q=' + query;
  }, 1000);
}


    
    //Cart + Add Product
    const productForm = $(".form-product-ajax")
    productForm.submit(function (event) {
      event.preventDefault();
      // console.log("O formulário não foi enviado!");
      // o this pega os dados relacionados a esse form
      const thisForm = $(this);
      //const actionEndpoint = thisForm.attr("action");
      const actionEndpoint = thisForm.attr("data-endpoint");
      const httpMethod = thisForm.attr("method");
      const formData = thisForm.serialize();
      $.ajax({
        url: actionEndpoint,
        method: httpMethod,
        data: formData,
        success: function (data) {
          // console.log("Sucesso")
          // console.log(data)
          // console.log("Adicionado", data.added)
          // console.log("Removido", data.removed)
          const submitSpan = thisForm.find(".submit-span")
          if (data.added) {
            submitSpan.html("<button type='submit' class='btn btn-outline-danger'>Excluir</button>")
          } else {
            submitSpan.html("<button type='submit' class='btn btn-success'>Adicionar</button>")
          }
          const navbarCount = $(".navbar-cart-count")
          navbarCount.text(data.cartItemCount)
          const currentPath = window.location.href
          if (currentPath.indexOf("cart") != -1) {
            refreshCart()
          }
        },
        error: function (errorData) {
          $.alert({
            title: "Oops!",
            content: "Ocorreu um erro, tente mais tarde novamente!",
            theme: "modern",
          })
          console.log("Erro")
          console.log(errorData)
        }
      })
    })
    function refreshCart() {
      //console.log("Excluído do carrinho atual!")
      const cartTable = $(".cart-table")
      const cartBody = cartTable.find(".cart-body")
      //cartBody.html("<h1>Mudou!</h1>")
      const productsRow = cartBody.find(".cart-product")
      const currentUrl = window.location.href
      const refreshCartUrl = '/api/cart/';
      const refreshCartMethod = "GET";
      const data = {};
      $.ajax({
        url: refreshCartUrl,
        method: refreshCartMethod,
        data: data,
        success: function (data) {
          console.log(data)
          const hiddenCartItemRemoveForm = $(".cart-item-remove-form")
          if (data.products.length > 0) {
            productsRow.html(" ")
            let i = data.products.length
            $.each(data.products, function (index, value) {
              const newCartItemRemove = hiddenCartItemRemoveForm.clone()
              newCartItemRemove.css("display", "block")
              newCartItemRemove.find(".cart-item-product-id").val(value.id)
              // Constrói a nova linha da tabela com uma classe padrão 'cart-item'
              let newRowHTML = "<tr class='cart-product cart-item'><th scope=\"row\">" + i +
                "</th><td><a  style='color: black; text-decoration: none' href='" + value.url + "'>" + value.name + "</a>" + "<td>" + newCartItemRemove.html() + "</td>" + "<td>" + value.price + "</td></tr>";

              // Adiciona a nova linha ao início do corpo da tabela
              cartBody.prepend(newRowHTML);
              i--;

              // Alternar entre as classes table-light e table-warning para as linhas da tabela
              let cartItems = document.querySelectorAll('.cart-item');
              cartItems.forEach((item, index) => {
                if (index % 2 === 0) {
                  item.classList.remove('table-warning');
                  item.classList.add('table-light');
                } else {
                  item.classList.remove('table-light');
                  item.classList.add('table-warning');
                }
              });
            });
            cartBody.find(".cart-subtotal").text(data.subtotal)
            cartBody.find(".cart-total").text(data.total)
          } else {
            window.location.href = currentUrl
          }
        },
        error: function (errorData) {
          $.alert({
            title: "Oops!",
            content: "Ocorreu um erro, tente mais tarde novamente!",
            theme: "modern",
          })
          console.log("Erro")
          console.log(errorData)
        }
      })
    }
  })
