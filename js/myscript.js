import CI360Viewer from './ci360.service.js';



// --------------------- small helpers ------------------------------

function is_piece(id){
  return id.includes(".")
}


// --------------------- ONCLICK Functions ----------------------------

  function activate_entry(event) {

    // console.log("Activating Rock Entry!");
    console.log("click event:");
    console.log(event);
    // let container = document.getElementById(event.target.id); 

    let container = null;

    if (event.target != null){
      container = event.target;
    }
    else{
      container = event;
    }
    // if this has already been called then bail
    if (container.classList.contains("initialized")){
      return null;  
    } 

    console.log("Activating Entry for " + container.id + "!");

    set_default_360_attributes(container);

    container.removeAttribute("onclick");
    
    // remove the i360 icon
    let icon = container.querySelector(".icon360");
    icon.style = "visibility: hidden;"

      let jsonfile = ""
    // fetch the apropriate rock json file and load the image data in the 360 viewer
    if (is_piece(container.id)){
      jsonfile = "pieces/" + container.id + "/" + container.id + ".json" // TODO: change to common function
    }
    else {
      jsonfile = "rocks/" + container.id + "/" + container.id + ".json" // TODO: change to common function
    }

    fetch(jsonfile)
    .then(response => response.json())
    .then(json => {
        let list = build_image_list(json, container.id);
        console.log("Instantiating 360 viewer for " + container.id + "...");
        let viewer = new CI360Viewer(container, false, null, JSON.stringify(list));
        container.viewer = viewer;
        });
  }

     // on click helper functions
  function set_default_360_attributes(container) {
    // console.log("Applying default attributes " + container.id + " 360 viewer");  
    container.setAttribute("data-folder","https://i.imgur.com/");
    container.setAttribute("amount",180);
    container.setAttribute("data-magnifier",2);
    // container.setAttribute("data-spin-reverse", '');
    container.setAttribute("data-spin", '');
    container.setAttribute("speed", 100);
    container.setAttribute("drag-speed", 250);
  }

  function build_image_list(jsondata, rock_id) {
    console.log("Building " + rock_id + " Image List...");
    let imagerocklist = [];
    var rock;
    for (let i = 1; i < jsondata.image_count + 1; i++){
        rock = jsondata[i];
        imagerocklist.push(rock.id + ".jpg");
    }
    return imagerocklist;
  }


// --------------------- ELEMENT CREATION HELPERS ---------------------

// autoplay controls
function create_autoplay_controls(viewerbox) {
  let controls = document.createElement('div');
  controls.className = "autoplay-controls";

  // p element
  let text = document.createElement('p');
  text.style = "padding-right: .5em; font-size: 120%; margin: 0;"
  text.innerText= "Autoplay";

  // Left autoplay button
  let autoplay_l = document.createElement('button');
  autoplay_l.innerHTML = '<span class="arrow left">'
  autoplay_l.addEventListener("click", function (e) { autoplay_left(e,viewerbox)} )

  // Right autoplay button
  let autoplay_r = document.createElement('button');
  autoplay_r.innerHTML = '<span class="arrow right">'
  autoplay_r.addEventListener("click", function (e) { autoplay_right(e,viewerbox)} )
  
  // add elements to header, order here matters
  controls.appendChild(text);
  controls.appendChild(autoplay_l);
  controls.appendChild(autoplay_r);

  return controls;
}

// Header stuffs
  function create_header(rock_id, viewerbox) {
    let header = document.createElement('div');
    header.className = "header";

    // creating link  ### TODO ### change for new directory structure
    let link = document.createElement('a');
    link.setAttribute('href', "rocks/" + rock_id + ".html" );
    link.innerHTML= "<h1> " + rock_id + " </h1>";

    // creating autoplay button
    let autoplay_controls = create_autoplay_controls(viewerbox)

    // add elements to header, order matters
    header.appendChild(link);
    header.appendChild(autoplay_controls);

    return header;
  }




// footer stuffs
  function create_rock_footer(rock_info) {
    // make all the Elements
    let footer = document.createElement('div');
    footer.className = 'footer';

    let measurements = document.createElement('div');
    measurements.className = 'measurements';

    let details_comments = document.createElement('div');
    details_comments.className = 'details_comments';

    let details = document.createElement('div');
    details.className = 'details';

    let comments = document.createElement('div');
    comments.className = 'comments';

    // using fake data until actual data is created and brought into repo
    let measurements_table = document.createElement('table');
    let measurements_fakedata = {"Weight:": "N/A", "Volume:": "N/A", "Density:" : "N/A" };

    // using more fake data for the details table
    let details_table = document.createElement('table');
    let details_fakedata = {"Status:": "Broke", "Method:": "Tile Saw", "Pieces:" : "4" };
    

    populate_table(measurements_table, rock_info["Measurements"]);
    measurements.appendChild(measurements_table);

    populate_table(details_table, rock_info["Details"]);
    details.appendChild(details_table);

    comments.innerHTML += "Comments: <br>" + rock_info["Comments"];
  
    /* append the created divs to the footer */
    details_comments.append(details)
    details_comments.append(comments)
    footer.appendChild(measurements);
    footer.appendChild(details_comments);

    return footer;
  }

  function create_piece_footer(piece_info) {
    let footer = document.createElement('div');
    footer.className = 'footer';

    let type_section = document.createElement('div');
    type_section.className = 'typestuff';

    let beauty_comments = document.createElement('div');
    beauty_comments.className = 'beauty_comments';

    let beauty = document.createElement('div');
    beauty.className = 'beauty';

    let comments = document.createElement('div');
    comments.className = 'comments';

    let type_table = document.createElement('table');
    let beauty_table = document.createElement('table');

    populate_table(type_table, piece_info["Type"]);
    type_section.appendChild(type_table);

    populate_table(beauty_table, piece_info["Beauty"]);
    beauty.appendChild(beauty_table);

    comments.innerHTML += "Comments: <br>" + piece_info["Comments"];
  
    /* append the created divs to the footer */
    beauty_comments.append(beauty)
    beauty_comments.append(comments)
    footer.appendChild(type_section);
    footer.appendChild(beauty_comments);

    return footer;
  }


  function populate_table(table, data){
    let key = null;
    // iterate through the json data and
    // make a row with individual cells for each key value pair
    for (key in data) {
      let row = table.insertRow();
      let field = row.insertCell();
      let text = document.createTextNode(key + ":");
      field.appendChild(text);
      field = row.insertCell();
      text = document.createTextNode(data[key])
      field.appendChild(text);
      }
  }




// rock viewer stuffs
  function create_entry_viewer(item_id, item_data) {
    let viewerBox = document.createElement('div');
    viewerBox.className = 'entryviewer';
    viewerBox.id = item_id;

    // get background image from rock data 
    let first_image_dict = item_data["first_image"]
    let first_image_url = "https://i.imgur.com/" + first_image_dict["id"] + ".jpg"

    // asign style can be offloaded
    viewerBox.style.maxWidth ="500px"
    viewerBox.style.width ="500px"
    viewerBox.style.height ="500px"
  
    viewerBox.style.backgroundImage = "url(" + first_image_url + ")";
    viewerBox.style.backgroundPosition = "0% 0%"
    viewerBox.style.backgroundSize = "contain"
    viewerBox.style.backgroundRepeat = "no-repeat";
    viewerBox.style.backgroundSize = "500px";


    // image buttons 
    let prev_button = document.createElement('button');
    prev_button.className = "cloudimage-360-prev";
    let next_button = document.createElement('button');
    next_button.className = "cloudimage-360-next";
    viewerBox.appendChild(prev_button);
    viewerBox.appendChild(next_button);

    let icon = document.createElement('div');
    icon.className = "icon360";
    viewerBox.appendChild(icon);

    // interactivity 
    viewerBox.addEventListener("click", activate_entry , {once: true});

    return viewerBox;
  }


  function add_entry(showcase, item_id, item_data) {
    console.log("Adding a new entry")

    // create the rockentry container div
    let entry = document.createElement('div');
    if (is_piece(item_id)) {
      entry.className = "pieceentry"
    } else{
      entry.className = "rockentry"
    } 

    // if item is 360 use viewer
    // if item is slideshow need a new slideshow maker function
    let entryviewer = create_entry_viewer(item_id, item_data);

    
    let header = create_header(item_id, entryviewer);


    let footer = null
    /* the footers for pieces and rocks are slightly different and warrant 
       a new different function for there construction */
    if (is_piece(item_id)){
      footer = create_piece_footer(item_data["info"])
    } else {
      footer = create_rock_footer(item_data["info"])
    }

    // add whole entry element to the grid define showcase
    showcase.appendChild(entry);

    // apppend the created elements to the entry element
    entry.appendChild(header)
    entry.appendChild(entryviewer);
    entry.appendChild(footer);
  }

// ---------------------------- AUTOPLAY ----------------------------
  function autoplay_toggle(event,viewerBox){

  // console.log("viewer object:")
  // console.log(viewerBox.viewer)
  // console.log("box:")
  // console.log(viewerBox)

  // if the viewer isnt loaded set the auto play att and then call the load function
  if (! viewerBox.viewer) {
    viewerBox.setAttribute('autoplay', '');
    activate_entry(viewerBox)
    return
  }

  // toggle code
  if (viewerBox.viewer.autoplay) {
    viewerBox.viewer.stop();
    viewerBox.viewer.autoplay = false;
  }
  else {
    viewerBox.viewer.play();
    viewerBox.viewer.autoplay = true;
  }
}

function autoplay_left(event,viewerBox){
  // Reverse is true
  // if the viewer isnt loaded set the auto play attribute and then call the load function
  if (! viewerBox.viewer) {
    // need both attributes for the autoplay to start in reverse
    viewerBox.setAttribute('autoplay', '');
    viewerBox.setAttribute('autoplay-reverse', '');
    activate_entry(viewerBox)
    return
  }

  // if going in the this autoplay direction just stop it
  if (viewerBox.viewer.autoplay && viewerBox.viewer.reversed ) {
    viewerBox.viewer.stop();
    viewerBox.viewer.autoplay = false;
  }
  // if going in the opposite autoplay direction just change the direction
  else if (viewerBox.viewer.autoplay && !viewerBox.viewer.reversed ) {
    viewerBox.viewer.stop();
    viewerBox.viewer.reversed = true;
    viewerBox.viewer.play();
  }
  // if its not autoplaying, autoplay
  else {
    viewerBox.viewer.reversed = true;
    viewerBox.viewer.play();
    viewerBox.viewer.autoplay = true;
  }
}

function autoplay_right(event,viewerBox){
  // reverse is false
  // if the viewer isnt loaded set the auto play attribute and then call the load function
  if (! viewerBox.viewer) {
    viewerBox.setAttribute('autoplay', '');
    activate_entry(viewerBox)
    return
  }

  // if going in the this autoplay direction just stop it
  if (viewerBox.viewer.autoplay && !viewerBox.viewer.reversed) {
    viewerBox.viewer.stop();
    viewerBox.viewer.autoplay = false;
  }
  // if going in the opposite autoplay direction just change the direction
  else if (viewerBox.viewer.autoplay && viewerBox.viewer.reversed ) {
    viewerBox.viewer.stop();
    viewerBox.viewer.reversed = false;
    viewerBox.viewer.play();
  }
  // if its not autoplaying, autoplay
  else {
    viewerBox.viewer.reversed = false;
    viewerBox.viewer.play();
    viewerBox.viewer.autoplay = true;
  }
}

function autoplay_stop(event,viewerBox){

  console.log("viewer object:")
  console.log(viewerBox.viewer)
  console.log("box:")
  console.log(viewerBox)

  viewerBox.viewer.stop();
  viewerBox.viewer.autoplay = false;
}
// ------------------------------------------------------------------

// helper function to all for non-automated adding of rock entrys to showcases
// setup now with example rocks
// defunct now but may redo in the future
function add_rock_entry_adhoc() {
let showcase = document.getElementById("showcase"); 
  let rock_data = {'first_image': {'id': '5k1Orih', 'name': 'R2_adjusted_1x1_180_1.jpg'}, 'image_count': 180}
  add_entry(showcase, "R2", rock_data)
}

function kickoff_rocks(showcase, json){
  let key = null;
  // let rock_count = json["rock_count"]
  let rocks = json["rocks"]
  // console.log(rocks)
    for (key in rocks) {
      // console.log(key)
      // console.log(rocks[key])
      add_entry(showcase, key, rocks[key])
    }
}

function kickoff_pieces(showcase, json){
  let key = null;
  let pieces = json["pieces"]
    for (key in pieces) {
      add_entry(showcase, key, pieces[key])
    }
}


// ---------------------- EXPORTING FUNCTIONS ---------------------
// "export" local functions to a global var to be called for testing in the html page
window.test.activate_entry = activate_entry;
window.test.add_rock_entry = add_entry;
window.test.autoplay_toggle = autoplay_toggle;
window.test.autoplay_stop = autoplay_stop;
window.test.autoplay_left = autoplay_left;
window.test.autoplay_right = autoplay_right;
window.test.add_rock_entry_adhoc = add_rock_entry_adhoc;


// ------------------------- ONLOAD -------------------------------
// onload listner, automates the loading of rock entries to the showcase by
// asynchronously loading the rock catalog and iterating through the available rocks
// and loading them
// also stands as the first code loaded on page load, useful for quick debugging 
window.addEventListener('load', (event) => {
  console.log('The page has fully loaded');
  let rock_showcase = document.getElementById("rock-showcase");
  let piece_showcase = document.getElementById("piece-showcase"); 
  let rock_jsonfile = "rocks/rockcatalog.json"
  let piece_jsonfile = "pieces/piececatalog.json"
  // var fileName = location.href.split("/").slice(-1); 
  console.log(location)
  console.log(location.href)
  console.log(location.href.split("/"))
  console.log(location.href.split("/").slice(-1))
  // rocks
  fetch(rock_jsonfile)
  .then(response => response.json())
  .then(json => {
        kickoff_rocks(rock_showcase, json)
      });
  // pieces
  fetch(piece_jsonfile)
  .then(response => response.json())
  .then(json => {
        kickoff_pieces(piece_showcase, json)
      });
});