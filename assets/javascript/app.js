/*******************************************************************************
 * Script for GifTastic Assignment
*******************************************************************************/

$(document).ready(function() {                  // Wait on document to load

    /***************************************************************************
     * Application variables
    ***************************************************************************/
    const giphyURL = "https://api.giphy.com/v1/gifs/search?q=";     
    const giphyKey = "&api_key=s1NfkVPfnihtRTIWxHcSmAgv65Q3Y2GU";  
    const giphyLimit = "&limit=10";             // max gifs to return              

    let topics = [];                            // Array to search terms
    const defaultTopics = [                     // Initial default searches
        "Trending",                             // ...add to array for more
        "Winner", 
        "Loser",
        "Start Over",
        "Enter",
        "Exit",
        "Try Again"
    ];         
                                                
    const STATIC = "static";                    // topic image states
    const DYNAMIC = "dynamic";

    let lastTopicClicked = -1;                  // Last topic button clicked
    /***************************************************************************
     * Topic Object Definition
     * This object is used to define each gif topic the user has defined. It 
     * prevents having to repeatedly download Giphy data.
    ***************************************************************************/
    class Topic {
    constructor(key) {
        this.key = key;                     // Object id = topic button text
        this.searchString = this.key.replace(" ", "+");
        this.initialized = false;           // Status of object
        this.ratings = [];                  // Ratings for each GIF image
        this.titles = [];                   // GIF title
        this.state = [];                    // GIF state ('static', 'dynamic')
        this.staticImages = [];             // GIF static image
        this.dynamicImages = [];            // GIF dynamic image
    }
}
/***************************************************************************
     * Helper Functions
    ***************************************************************************/

    // Render the topic buttons dynamically for gif searches, and add a click 
    // event handler for each of the buttons. 
    function renderButtons() {
        $("#search-buttons").empty();           // Clear existing buttons

        topics.forEach(function(topic, index) {
            let btn = $("<button>");            // button element
            btn.attr({                          // button attributes
                type: "button",
                class: "gif-search"
            });
            btn.attr("data-index", index.toString());
            btn.text(topic.key);                // button text
            $("#search-buttons").append(btn);
        });

        // Add the event handler to each button
        $("button.gif-search").each(function(index, element) {
            this.addEventListener("click", topicClick);
        });
    }

    // Add a topic to the topics array and sort the array into case-insensitive,
    // ascending sequence
    function addTopic(newTopic) {
        let topic = new Topic(newTopic);        // create Topic object
        topics.push(topic);                     // add it to the array
        topics.sort(function(a, b) {            // sort the array
            let first = a.key.toLowerCase();
            let second = b.key.toLowerCase();
            if (first < second) {
                return -1;
            } else if (second < first) {
                return 1;
            }
            return 0;
        });
    }

    // Determine if anything was entered for a new topic
    function isBlank(value) {
        return value.length === 0 ? true : false;
    }
    
    // Determine if the new topic is a duplicate
    function isDuplicate(value) {
        let tempKey = value.toLowerCase();
        let result = false;
        for (let i = 0; i < topics.length; i++) {   
            if (tempKey === topics[i].key.toLowerCase()) {
                result = true;
                break;
            }
        };
        return result;
    }

    /***************************************************************************
     * Handle Giphy Requests & Results
    ***************************************************************************/
    // Display static images and add event handler to each image element
    function displayImages(topic) {
        $("#gif-images").empty();               // Clear old images  

        let topicDiv = $("<div>");              // card-columns div
        topicDiv.attr("class", "card-columns")

        for (let i = 0; i < topic.titles.length; i++) {
            let gifDiv = $("<div>");            // card div
            gifDiv.attr("class", "card");

            let gifBody = $("<div>");           // card-body div
            gifBody.attr("class", "card-body");
            gifBody.text(`Rating: ${topic.ratings[i]}`);
            
            let gifImage = $("<img>");          // card-img-bottom
            gifImage.attr({
                src: topic.staticImages[i],
                alt: topic.titles[i],
                class: "card-img-bottom",
                style: "width: 100%"
            });
            topic.state[i] = STATIC;
            gifImage.attr("data-index", i.toString());

            gifDiv.append(gifBody, gifImage);
            topicDiv.append(gifDiv);
        }
        $("#gif-images").append(topicDiv);
        $("img.card-img-bottom").each(function(index, element){
            this.addEventListener("click", gifClick);
        });
    }

    // Extract Giphy image urls
    function extractImages(topic, gifObjects) {
        for (let i = 0; i < gifObjects.length; i++) {
            topic.ratings[i] = gifObjects[i].rating;
            topic.titles[i] = gifObjects[i].title;
            topic.dynamicImages[i] = gifObjects[i].images.fixed_height_small.url;
            topic.staticImages[i] = gifObjects[i].images.fixed_height_small_still.url;
        }
    }

    // Submit a search to Giphy
    // Create the search URL and send the AJAX request. If successful, 
    // extract the giphy data and update the Topic object. If not, notify the 
    // user.
    function searchGiphy(topic) {
        let searchURL = giphyURL + topic.searchString + giphyKey + giphyLimit;
        $.ajax({                                // Send AJAX 'GET' request
            url: searchURL,
            method: "GET"
        }).done(function(response) {            // Successful
            console.log("searchGiphy() response.data:", response.data);
            topic.initialized = true;           // update state
            extractImages(topic, response.data);
            displayImages(topic);
        }
        ).fail(function(xhr, status, errorThrown){  // Failure
            alert("Sorry, there was a problem with the Giphy request!");
            console.log("Error:", errorThrown);
            console.log("Status:", status);
        });
    }

    /***************************************************************************
     * Event Handlers
    ***************************************************************************/
    // Submit button clicked or ENTER pressed
    // Prevent default action for Submit. Ensure a term was entered and that it
    // is not a duplicate. Add the button to the page. Buttons are sorted into
    // case-insensitive, ascending order.
    function submitClicked(event) {
        event.preventDefault();                 // Prevent Form submission

        let newTopic = $("#search-term").val().trim();  // Strip white space

        if (isBlank(newTopic)) {                // Ensure something entered
             alert("Blank search term or phrase. Re-try!");
             $("#search-term").focus();
             return;
        }

        if (isDuplicate(newTopic)) {            // Ensure not a duplicate
            alert("The search term or phrase entered already exists.");
            $("#search-term").focus();
            return;
        }
                                       
        addTopic(newTopic);                     // Add the topic
        renderButtons();                        // Create the buttons
        $("#search-term").val("");              // clear input & focus
        $("#search-term").focus();
    }

    // Topic button clicked
    // Search Gipfy for a term or phrase, create the query objects, and display
    // images, otherwise, display the images from the query object.
    function topicClick(event) {
        console.log("topicClick - this:", this);
        console.log("topicClick - $(this):", $(this));
        let topicIdx = parseInt($(this).attr("data-index"));  // Get topic index
        let topic = topics[topicIdx];           // topic object

        if (!topic.initialized) {               // topic initialized?
            searchGiphy(topic);                 // no - search giphy
        } else {                                // yes - display gifs
            displayImages(topic);
        }
        lastTopicClicked = topicIdx;            // Save last topic index
    }

    // GIF Image Clicked
    function gifClick(event) {
        console.log("gifClick() entered - this:", this);
        console.log("gifClick() entered - $(this):", $(this));
        let topic = topics[lastTopicClicked];
        let imageIdx = parseInt($(this).attr("data-index"));
        if (topic.state[imageIdx] === STATIC) {
            $(this).attr("src", topic.dynamicImages[imageIdx]);
            topic.state[imageIdx] = DYNAMIC;
        } else {
            $(this).attr("src", topic.staticImages[imageIdx]);
            topic.state[imageIdx] = STATIC;
        }
    }

    /***************************************************************************
     * Application initialization
    ***************************************************************************/
    for (let i = 0; i < defaultTopics.length; i++) {    // Set default topics
        addTopic(defaultTopics[i]); 
    }                        
    renderButtons();                                // Display topic buttons
    $("#add-search").on("click", submitClicked);    // Handler to add topic button

});