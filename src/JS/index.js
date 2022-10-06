import "../CSS/style.css";
let inputSearch = document.getElementById("search-input");
let bookSection = document.getElementById("book-section");
const baseUrl = "https://openlibrary.org";
let sectionHeading = document.createElement("h2");
sectionHeading.innerText = "Choose your book:";
let bookList = document.createElement("ul");
let spinner = document.createElement("div");
spinner.className = "spinner";
let descriptionDiv = document.createElement("div");
descriptionDiv.className = "description-div";

document
  .getElementById("search-button")
  .addEventListener("click", function (e) {
    e.preventDefault();
    //Spinner
    bookSection.appendChild(spinner);
    axios
      .get(`${baseUrl}/subjects/${inputSearch.value.toLowerCase()}.json`)
      .then((response) => {
        spinner.remove();
        //Invalid genre alert
        if (response.data.works.length === 0) {
          swal("Insert a valid genre!");
          if (bookList) {
            bookList.remove();
            sectionHeading.remove();
          }
          return;
        }
        //Set the book list's h2 and ul
        bookSection.appendChild(sectionHeading);
        bookSection.appendChild(bookList);
        //Replace old results
        if (bookList.hasChildNodes()) {
          bookList.replaceChildren();
        }
        //Create the list of results
        const works = _.get(
          response,
          "data.works",
          "Error, try to reload the page"
        );

        works.map((book, index) => {
          let bookKey = book.key;
          let singleBook = document.createElement("li");
          let descriptionButton = document.createElement("button");
          let authorsList = _.get(
            book,
            "authors",
            "Author's name not available"
          );

          let authors = authorsList.map((authorObj) => {
            return authorObj.name;
          });

          singleBook.innerText = book.title + " - " + authors;
          descriptionButton.innerText = "Description";
          descriptionButton.className = "info-button";
          bookList.appendChild(singleBook);
          singleBook.appendChild(descriptionButton);
          inputSearch.value = "";

          descriptionButton.addEventListener("click", function (e) {
            e.preventDefault();
            axios.get(`${baseUrl}${bookKey}.json`).then((response) => {
              //Description and button's inner text handling
              const descriptionIsOpen = !!descriptionDiv;
              if (
                descriptionIsOpen &&
                descriptionButton.innerText === "Close"
              ) {
                descriptionDiv.remove();
                descriptionButton.innerText = "Description";
                return;
              }
              if (descriptionIsOpen) {
                descriptionDiv.remove();
              }
              //Description path
              singleBook.appendChild(descriptionDiv);
              let descriptionPath = _.get(response, "data.description", "");
              let descriptionPath1 = _.get(
                response,
                "data.description.value",
                ""
              );

              let description = !response.data.description
                ? "Description not available"
                : descriptionPath1 || descriptionPath;

              descriptionDiv.innerText = description;
              descriptionButton.innerText = "Close";
            });

            // Change the text of all buttons except the one clicked
            const allBookDescriptionButtons = Array.from(
              document.querySelectorAll(".info-button")
            );
            allBookDescriptionButtons.map((el, idx) => {
              if (index === idx) return;
              el.innerText = "Description";
            });
          });
        });
      })
      .catch((error) => {
        //Error handling
        spinner.remove();
        swal("Insert a valid genre!");
        if (bookList) {
          bookList.remove();
          sectionHeading.remove();
        }
      });
  });
