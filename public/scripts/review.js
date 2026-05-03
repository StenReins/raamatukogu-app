let form = document.getElementById('review-form');

form.addEventListener('submit', (e) => {
    e.preventDefault();
    console.log(e)

    let rating = form.querySelector('input[name="star-radio"]:checked')?.value;
    let review = form.querySelector('#review').value;
    
    console.log({ rating, review });
});