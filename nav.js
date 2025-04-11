const headerTemplate = document.createElement('template');

headerTemplate.innerHTML = `
  <style>
	.scroll-box {
        width: 30%; /* Adjust the width as needed */
        height: 150px; /* Fixed height to limit the visible area */
        border: 3px solid black;
        padding: 10px;
        background-color: #f9f9f9;
        overflow-y: scroll;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        transition: opacity 0.3s ease; /* Smooth transition for visibility */
        position: absolute; /* Overlay positioning */
        top: 45%; /* Center vertically */
        left: 50%; /* Center horizontally */
        transform: translate(-50%, -50%); /* Adjust positioning to center */
        display: none; /* Initially hidden */
        z-index: 1000; /* Ensure it appears above other content */
    }

    .scroll-box.visible {
        display: block; /* Show the overlay when the class is toggled */
    }
	
	.scroll-box .close-message {
        font-family: monospace;
		font-size: 8px;
        color: grey;
        margin-bottom: 10px;
        text-align: center;
        font-style: italic;
    }

    .scroll-box .search-box {
        width: 90%;
        padding: 5px;
        margin-bottom: 10px;
        font-family: monospace;
		font-size: 12px;
        border: 1px solid #ccc;
        border-radius: 4px;
    }

    .scroll-box ol {
        font-family: monospace;
		margin: 0; /* Remove extra margins */
        padding: 0; /* Remove extra padding */
        list-style-position: inside; /* Ensure list numbers are visible within the box */
		color: red;
    }

	.scroll-box ol a{
		font-family: monospace;
		text-decoration: underline grey dotted;
		text-underline-offset: 5px;
		color: black;
	}

    .scroll-box li {
        padding: 5px 0; /* Add spacing between list items */
    }

    .list-button {
        font-family: monospace;
        font-size: 10px;
        padding: 5px 10px;
        margin: 10px auto;
        color: black;
        border: none;
        border-right: 1px solid grey;
        border-bottom: 1px solid grey;
        cursor: pointer;
        box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.2);
        transition: background-color 0.1s ease;
    }

    .list-button:active {
        color: white;
        background-color: grey;
    }

    /* Overlay styles */
    #overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
        display: none;
        z-index: 999; /* Ensure it appears below the scroll box */
    }

    #overlay.visible {
        display: block;
    }
	
	@media (max-width: 600px) {
		.scroll-box {
			width: 70%;}
	}
  </style>

  <button class="list-button" aria-label="Toggle List">Page</button>
  <div id="overlay"></div>
  <div class="scroll-box" id="scroll-box">
      <div class="close-message">Click outside this box to close it</div>
      <input
        type="text"
        class="search-box"
        id="search-box"
        placeholder="Search..."
        aria-label="Search list items"
      />
      <ol id="list">
          <li><a href="index.html">Data</a></li>
          <li><a href="index2.html">Form</a></li>
      </ol>
  </div>
`;

class Header extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    const shadowRoot = this.attachShadow({ mode: 'open' });
    shadowRoot.appendChild(headerTemplate.content.cloneNode(true));

    const button = shadowRoot.querySelector('.list-button');
    const scrollBox = shadowRoot.querySelector('.scroll-box');
    const overlay = shadowRoot.querySelector('#overlay');
    const searchBox = shadowRoot.querySelector('#search-box');
    const list = shadowRoot.querySelector('#list');

    // Toggle scroll box visibility
    button.addEventListener('click', (event) => {
      event.stopPropagation(); // Prevent propagation
      toggleScrollBox(scrollBox, overlay);
    });

    // Prevent clicks inside the scroll box from closing it
    scrollBox.addEventListener('click', (event) => {
      event.stopPropagation();
    });

    // Close scroll box if clicked outside
    document.addEventListener('click', function (event) {
      if (
        scrollBox.classList.contains('visible') &&
        !scrollBox.contains(event.target) &&
        !event.target.matches('.list-button')
      ) {
        hideScrollBox(scrollBox, overlay);
      }
    });

    // Add search functionality
    searchBox.addEventListener('input', function () {
      const filter = searchBox.value.toLowerCase();
      const items = list.querySelectorAll('li');
      items.forEach((item) => {
        const text = item.textContent.toLowerCase();
        item.style.display = text.includes(filter) ? '' : 'none';
      });
    });
  }
}

// Toggle function
function toggleScrollBox(scrollBox, overlay) {
  if (scrollBox.classList.contains('visible')) {
    hideScrollBox(scrollBox, overlay);
  } else {
    showScrollBox(scrollBox, overlay);
  }
}

// Show scroll box
function showScrollBox(scrollBox, overlay) {
  scrollBox.classList.add('visible');
  overlay.classList.add('visible');
}

// Hide scroll box
function hideScrollBox(scrollBox, overlay) {
  scrollBox.classList.remove('visible');
  overlay.classList.remove('visible');
}

customElements.define('header-component', Header);
