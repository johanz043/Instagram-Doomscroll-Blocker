// BLOCKS ELEMENTS ON A PAGE
function blockElements(selector, label) {
    const elements = document.querySelectorAll(selector); // Find all of the document's elements (insta posts) using CSS selector

    elements.forEach(el => { // Loops through each element (post)
        if (el.classList.contains("blocked")) return; // Skip if the element is already blocked (prevents duplicates)

        el.classList.add("blocked"); // Mark element as blocked if not already blocked

        el.style.position = "relative"; // Ensure the element can contain an overlay

        const blocker = document.createElement("div"); // Create a black overlay
        blocker.className = "post-blocker"; // Calls the post-blocker function from styles.css
        blocker.innerText = `🚫 ${label}`; // Add label text to show what was blocked

        el.appendChild(blocker); // Add overlay on top of the element
    });
}


// BLOCKS ELEMENTS BASED ON PAGE
function blockFeed() { // Blocks the main Instagram feed
    blockElements("article", "Post Blocked");
}

function blockReels() { // Blocks Reels page content
    blockElements("section, article", "Reel Blocked");
}

function blockExplore() { // Blocks Explore page content
    blockElements("article, section", "Explore Blocked");
}


// CHECKS WHICH PAGE THE USER IS ON (e.g. reels, explore, main feed, etc)
function checkPage() { // Determines which page the user is on and applies blocking rules
    const path = window.location.pathname;  // Get current URL path 

    if (path.startsWith("/direct")) { // If user is in messages (e.g. https://www.instagram.com/direct this will detect the /direct part)
        return;
    }
    if (path === "/" || path === "") { // Block posts on the main feed
        blockFeed();
        return;
    }
    if (path.startsWith("/reels")) { //Block reels on the reels page
        blockReels();
        return;
    }
    if (path.startsWith("/explore")) { //Block explore page posts
        blockExplore();
        return;
    }

    // Detect profile pages and blocks it
    const isProfilePage = path.split("/").length === 2 || (path.endsWith("/") && path.split("/").length === 3); // Detect profile pages

    if (isProfilePage) // Block posts on profile pages
    { 
        blockElements("article, section", "Profile Posts Blocked");
        return;
    }
    
    blockFeed();
}


// OBSERVES CHANGES IN THE PAGES
const observer = new MutationObserver(() => { // Observer to watch for new content being loaded in
    checkPage(); // Rerun blocking whenever page updates
});

observer.observe(document.body, { // Observes the entire page for changes
    childList: true,
    subtree: true
});

checkPage(); // Run once when script loads