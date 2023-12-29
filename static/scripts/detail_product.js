let slideIndex = 1;
showSlides(slideIndex);

function plusSlides(n) {
  showSlides(slideIndex += n);
}

function currentSlide(n) {
  showSlides(slideIndex = n);
}

function showSlides(n) {
  let i;
  let slides = document.getElementsByClassName("mySlides");
  let dots = document.getElementsByClassName("demo");
  if (n > slides.length) {slideIndex = 1}
  if (n < 1) {slideIndex = slides.length}
  for (i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";
  }
  for (i = 0; i < dots.length; i++) {
    dots[i].className = dots[i].className.replace(" active", "");
  }
  slides[slideIndex-1].style.display = "block";
  dots[slideIndex-1].className += " active";
}




function detail_product(id) {
  console.log(id)
    $.ajax({
        url: 'get_product_detail/'+ id,
        type: 'POST',
        success: function (response) {
            let body = $('#body-detail-product')
            let products = response.products[0]

            let content = `
              <div class="col-md-4" id="image-detail">
                  <div class="container-img">
                      <div class="mySlides">
                          <div class="numbertext">1 / 4</div>
                          <img src="/static/image/product/${products.image}" style="width:100%">
                      </div>
                      <div class="mySlides">
                          <div class="numbertext">2 / 4</div>
                          <img src="/static/image/product/${products.image}" style="width:100%">
                      </div>
                      <div class="mySlides">
                          <div class="numbertext">3 / 4</div>
                          <img src="/static/image/product/${products.image}" style="width:100%">
                      </div>
                      <div class="mySlides">
                          <div class="numbertext">4 / 4</div>
                          <img src="/static/image/product/${products.image}" style="width:100%">
                      </div>

                      <a class="prev" onclick="plusSlides(-1)">&#10094;</a>
                      <a class="next" onclick="plusSlides(1)">&#10095;</a>

                      <div class="caption-container"></div>

                      <div class="container">
                          <div class="row">
                              <div class="column-img">
                                  <img class="demo cursor" src="/static/image/product/${products.image}" style="width:100%" onclick="currentSlide(1)" alt="The Woods">
                              </div>
                              <div class="column-img">
                                  <img class="demo cursor" src="/static/image/product/${products.image}" style="width:100%" onclick="currentSlide(2)" alt="Cinque Terre">
                              </div>
                              <div class="column-img">
                                  <img class="demo cursor" src="/static/image/product/${products.image}" style="width:100%" onclick="currentSlide(3)" alt="Mountains and fjords">
                              </div>
                              <div class="column-img">
                                  <img class="demo cursor" src="/static/image/product/${products.image}" style="width:100%" onclick="currentSlide(4)" alt="Northern Lights">
                              </div>
                          </div>
                      </div>
                  </div>
              </div>
            `
            body.append(content)
        }
    })
}