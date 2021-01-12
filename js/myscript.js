import CI360Viewer from './ci360.service.js';


// --------------------- ONCLICK Functions ----------------------------

  function activate_rock_entry(event) {

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

    console.log("Activating Rock Entry for " + container.id + "!");

    set_default_360_attributes(container);

    container.removeAttribute("onclick");

    // fetch the apropriate rock json file and load the image data in the 360 viewer
    let jsonfile = "rocks/" + container.id + "/" + container.id + ".json" // TODO: change to common function
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
  function create_footer() {
    // make all the Elements
    let footer = document.createElement('div');
    footer.className = 'footer';

    let stats = document.createElement('div');
    stats.className = 'stats';

    let status_comments = document.createElement('div');
    status_comments.className = 'status_comments';

    let status = document.createElement('div');
    status.className = 'status';

    let comments = document.createElement('div');
    comments.className = 'comments';

    // using fake data until actual data is created and brought into repo
    let stats_table = document.createElement('table');
    let stats_fakedata = {"Weight:": "N/A", "Volume:": "N/A", "Density:" : "N/A" };

    // using more fake data for the status table
    let status_table = document.createElement('table');
    let status_fakedata = {"Status:": "Broke", "Method:": "Tile Saw", "Pieces:" : "4" };
    

    populate_table(stats_table, stats_fakedata);
    stats.appendChild(stats_table);

    populate_table(status_table, status_fakedata);
    status.appendChild(status_table);

    // fake comment data
    let comments_text = "Neat huh?";
    comments.innerHTML += "Comments: <br>" + comments_text;
  
    //append the created divs to the footer

    status_comments.append(status)
    status_comments.append(comments)
    footer.appendChild(stats);
    footer.appendChild(status_comments);

    return footer;
  }

  function populate_table(table, stats){
    let key = null;
    // iterate through the stats json data and
    // make a row with individual cells for each key value pair
    for (key in stats) {
      let row = table.insertRow();
      let field = row.insertCell();
      let text = document.createTextNode(key);
      field.appendChild(text);
      field = row.insertCell();
      text = document.createTextNode(stats[key])
      field.appendChild(text);
      }
  }




// rock viewer stuffs
  function create_rock_viewer(rock_id, rock_data) {
    let viewerBox = document.createElement('div');
    viewerBox.className = 'rockviewer';
    viewerBox.id = rock_id;

    // get background image from rock data 
    let first_image_dict = rock_data["first_image"]
    let first_image_url = "https://i.imgur.com/" + first_image_dict["id"] + ".jpg"

    // asign style can be offloaded
    viewerBox.style.backgroundImage = "url(" + first_image_url + ")";
    viewerBox.style.maxWidth ="500px"
    viewerBox.style.width ="500px"
    viewerBox.style.height ="500px"
    viewerBox.style.backgroundSize = "contain"
    viewerBox.style.backgroundRepeat = "no-repeat";
  
    // image buttons 
    let prev_button = document.createElement('button');
    prev_button.className = "cloudimage-360-prev";
    let next_button = document.createElement('button');
    next_button.className = "cloudimage-360-next";
    viewerBox.appendChild(prev_button);
    viewerBox.appendChild(next_button);

    // interactivity 
    viewerBox.addEventListener("click", activate_rock_entry , {once: true});

    return viewerBox;
  }



  function add_rock_entry(showcase, rock_id, rock_data) {
    console.log("Adding a new rock entry ")

    // create the rockentry container div
    let rockentry = document.createElement('div');
    rockentry.className = "rockentry"

    let rockviewer = create_rock_viewer(rock_id, rock_data);

    let header = create_header(rock_id, rockviewer);

    let footer = create_footer()
 
    // add whole entry element to the grid define showcase
    showcase.appendChild(rockentry);

    // apppend the created elements to the entry element
    rockentry.appendChild(header)
    rockentry.appendChild(rockviewer);
    rockentry.appendChild(footer);
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
   activate_rock_entry(viewerBox)
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
    activate_rock_entry(viewerBox)
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
    activate_rock_entry(viewerBox)
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
function add_rock_entry_adhoc() {
let showcase = document.getElementById("showcase"); 
 let rock_data = {'first_image': {'id': '5k1Orih', 'name': 'R2_adjusted_1x1_180_1.jpg'}, 'image_count': 180}
//  console.log(rock_data)
 add_rock_entry(showcase, "R2", rock_data)
}

function kickoff_rocks(showcase, json){
  let key = null;
  // let rock_count = json["rock_count"]
  let rocks = json["rocks"]
  // console.log(rocks)
    for (key in rocks) {
      // console.log(key)
      // console.log(rocks[key])
      add_rock_entry(showcase, key, rocks[key])
    }
}

// ---------------------- EXPORTING FUNCTIONS ---------------------
// "export" local functions to a global var to be called for testing in the html page
window.test.activate_rock_entry = activate_rock_entry;
window.test.add_rock_entry = add_rock_entry;
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
  let showcase = document.getElementById("rock-showcase"); 
  let jsonfile = "rocks/rockcatalog.json"
  // var fileName = location.href.split("/").slice(-1); 
  console.log(location)
  console.log(location.href)
  console.log(location.href.split("/"))
  console.log(location.href.split("/").slice(-1))
  fetch(jsonfile)
  .then(response => response.json())
  .then(json => {
       kickoff_rocks(showcase, json)
      });
});