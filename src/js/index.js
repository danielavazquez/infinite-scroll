const postsContainer = document.getElementById('posts-container');
const loading = document.querySelector('.loader'); //returns first element within document that matches specified selector
const filter = document.getElementById('filter');

let limit = 5;
let page = 1;


//*First bring in all DOM elements
//*Second create global variables limit, page used dynamically in fetch API function
//*Third create function to fetch posts async functionb getPosts()
//*Fourth show posts in DOM from API
//*Fifth add scroll functionality, first need an eventListener, then create showLoading function
//*Sixth add filter eventListener that listens for an input (any time someone types in something)
//*Seventh create filter function


//Fetch posts from API
//res.json() returns a promise with data
async function getPosts() {
  const res = await fetch(
    `https://jsonplaceholder.typicode.com/posts?_limit=${limit}&_page=${page}`
  );

  const data = await res.json();

  return data;
}


//Show posts in DOM
//const posts will be equal to getPosts because that returns a promise so we want to await getPosts();
async function showPosts() {
  const posts = await getPosts();

  //to display in DOM will create an element and update number id, title, and body
  posts.forEach(post => {
    const postEl = document.createElement('div');
    postEl.classList.add('post');
    postEl.innerHTML = `
      <div class="number">${post.id}</div>
      <div class="post-info">
        <h2 class="post-title">${post.title}</h2>
        <p class="post-body">${post.body}</p>
      </div>
    `;

    postsContainer.appendChild(postEl);
  });
}

//Show loader & fetch more posts
//here we want to add class of show because in CSS we set to have opacity of 1 if class of show was added
function showLoading() {
  loading.classList.add('show');

  //three circles will bounce and then after 1 sec it is changed to opacity 0 and increment page++, we scroll and it makes a new HTTP request
  setTimeout(() => {
    loading.classList.remove('show');

    setTimeout(() => {
      page++;
      showPosts();
    }, 300);
  }, 1000);
}

//Filter posts by input
//we pass in an event parameter, need to get what's typed
//get that by e.target.value, and capture that in a variable add toUpperCase since its case sensitive

//after we querySelector all posts classes, that will give us a nodeList which is basically an array
//can only filter posts that are in the DOM, if want to search more have to scroll more
function filterPosts(e) {
  const term = e.target.value.toUpperCase();
  const posts = document.querySelectorAll('.post'); //querySelector all we have more than one post

  posts.forEach(post => {
    const title = post.querySelector('.post-title').innerText.toUpperCase();
    const body = post.querySelector('.post-body').innerText.toUpperCase();

    //indexOf searches for whatever is typed in and if doesn't match returns -1
    //if greater than -1 means there is a match in the title or body
    //if there is a match, show the post, display 'flex' which is its original value
    if (title.indexOf(term) > -1 || body.indexOf(term) > -1) {
      post.style.display = 'flex';
    } else {
      post.style.display = 'none';
    }
  });
}


//Show initial posts
showPosts();

//will use destructuring instead of writing document.documentElement.scrollTop
//destructuring will allow us to pull variables out of an object
//then add condition, we want to show loader then fetch the rest of the posts
window.addEventListener('scroll', () => {
  const { scrollTop, scrollHeight, clientHeight } = document.documentElement;

  if (scrollTop + clientHeight >= scrollHeight - 5) {
    showLoading();
  }
});

//console.log(document.documentElement.scrollTop);
// with the above ^ when you scroll in console will see a series of numbers which is length from top to where we are scrolling
//can use scrollHeight as well


filter.addEventListener('input', filterPosts);