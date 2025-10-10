//select all the buttons
const buttons = document.querySelectorAll("button");
//loop through each button
buttons.forEach( button => {
button.addEventListener("click", function (e){
    //acess the data-id of the clicked button
    console.log("You clicked item with id:" + e.target.dataset.id);
});
});

