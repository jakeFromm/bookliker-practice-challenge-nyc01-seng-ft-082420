document.addEventListener("DOMContentLoaded", function() {
    const baseURL = "http://localhost:3000/books/"
    const currentUser = { "id": 1, "username": "pouros" }
    
    const getBooks = () => {
        fetch(baseURL)
            .then(resp => resp.json())
            .then(books => renderBooks(books))
    }

    const renderBooks = books => {
        for (const bookObj of books){
            renderBook(bookObj)
        }
    }

    function renderBook(bookObj){
        const bookLi = document.createElement("li")
        bookLi.classList.add("book")
        bookLi.dataset.bookId = bookObj.id
        bookLi.textContent = bookObj.title
        
        const bookList = document.querySelector("#list")
        bookList.append(bookLi)
    }

    function clickHandler(){
        document.addEventListener("click", e => {
            if (e.target.matches(".book")){
                let clickedBook = e.target
                let bookId = clickedBook.dataset.bookId
                fetch(baseURL + bookId)
                    .then(resp => resp.json())
                    .then(book => renderBookInfo(book))
            } else if (e.target.matches(".like-button")){
                let button = e.target
                let bookId = button.dataset.id
                fetch(baseURL + bookId)
                    .then(resp => resp.json())
                    .then(book => changeLike(book))  
            }
        })
    }

    const changeLike = (book) => {
        const users = book.users
        let alreadyLiked = users.find(user => user.username == currentUser.username)
        if (alreadyLiked){
            users.pop(currentUser)
        } else {
            users.push(currentUser)
        }
        patchLikes(users, book.id)
    }

    const patchLikes = (users, id) => {
        const options = {
            method: "PATCH",
            headers: {
                "content-type": "application/json",
                "accept": "application/json"
            },
            body: JSON.stringify({ users: users})
        }

        fetch(baseURL + id, options)
            .then(resp => resp.json())
            .then(book => renderBookInfo(book))
    }

    const renderBookInfo = (book) => {
        const bookPanel = document.querySelector("#show-panel")
        const usersWhoHaveLiked = book.users
        let alreadyLiked = usersWhoHaveLiked.find(user => user.username == currentUser.username)
        bookPanel.innerHTML = `
            <img src=${book.img_url}>
            <h1>Description:</h1>
            <p>${book.description}</p>
            <h3>Users Who Like This Book:</h3>
            `
        
        likesList = document.createElement("ul")
        likesList.classList.add("users-who-have-liked")
        
        for (const user of usersWhoHaveLiked) {
            likeLi = document.createElement("li")
            likeLi.dataset.id = user.id
            likeLi.textContent = user.username
            likesList.append(likeLi)
        }
        
        bookPanel.append(likesList)
        

        likeButton = document.createElement("button")
        likeButton.classList.add("like-button")
        likeButton.dataset.id = book.id
        likeButton.id = "like-button"
        if (alreadyLiked){
            likeButton.textContent = "UNLIKE"
        } else {
            likeButton.textContent = "LIKE"
        }
        


    
        
        
        bookPanel.append(likeButton)
    }
    

    

   
   getBooks();
   clickHandler();  
});
