
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
    // Cart + Add Product
    const productForm = $(".form-product-ajax");
    productForm.submit(function (event) {
        event.preventDefault();
        const thisForm = $(this);
        const actionEndpoint = thisForm.attr("action") || thisForm.attr("data-endpoint");
        const httpMethod = thisForm.attr("method") || "GET";
        const formData = thisForm.serialize();
        $.ajax({
            url: actionEndpoint,
            method: httpMethod,
            data: formData,
            success: function (data) {
                const submitSpan = thisForm.find(".submit-span");
                if (data.added) {
                    submitSpan.html("<button type='submit' class='btn btn-outline-danger'>Excluir</button>");
                } else {
                    submitSpan.html("<button type='submit' class='btn btn-outline-success'>Adicionar</button>");
                }
                updateCartCount(data.cartItemCount);
                if (window.location.pathname.includes("cart")) {
                    refreshCart();
                }
            },
            error: function (errorData) {
                $.alert({
                    title: "Oops!",
                    content: "Ocorreu um erro, tente novamente mais tarde!",
                    theme: "modern",
                });
                console.error("Erro ao enviar o formulário:", errorData);
            }
        });
    });

    function updateCartCount(count) {
        const navbarCount = $(".navbar-cart-count");
        if (navbarCount.length) {
            navbarCount.text(count);
        }
    }

    function refreshCart() {
        const cartTable = $(".cart-table");
        const cartBody = cartTable.find(".cart-body");
        const refreshCartUrl = '/api/cart/';
        $.get(refreshCartUrl, function (data) {
            const hiddenCartItemRemoveForm = $(".cart-item-remove-form");
            cartBody.empty();
            if (data.products.length > 0) {
                $.each(data.products, function (index, value) {
                    const newCartItemRemove = hiddenCartItemRemoveForm.clone().css("display", "block");
                    newCartItemRemove.find(".cart-item-product-id").val(value.id);
                    let newRowHTML = "<tr class='cart-product'>" +
                        "<th scope='row'>" + (index + 1) + "</th>" +
                        "<td><a href='" + value.url + "' style='color: black; text-decoration: none'>" + value.name + "</a></td>" +
                        "<td>" + newCartItemRemove.html() + "</td>" +
                        "<td>" + value.price + "</td>" +
                        "</tr>";
                    cartBody.append(newRowHTML);
                });
                cartBody.find(".cart-subtotal").text(data.subtotal);
                cartBody.find(".cart-total").text(data.total);
            } else {
                window.location.reload();
            }
        }).fail(function (errorData) {
            $.alert({
                title: "Oops!",
                content: "Ocorreu um erro ao atualizar o carrinho, tente novamente mais tarde!",
                theme: "modern",
            });
            console.error("Erro ao atualizar o carrinho:", errorData);
        });
    }
});