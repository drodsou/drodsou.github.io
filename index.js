import {getGists, getGistsFake, getRepos, fetchGet } from './github.js';
import {Header, Filter, Table} from './components.js';

var app = {
  user : '',
  files : [],
  filter : '',
  filesFiltered : [],
  set : function(prop, value) {
    this[prop] = value
    render()
  },
  loading : true
}

// debug
window.app = app;

window.addEventListener('hashchange',init)
init()


 // -- HELPERS

/**
 * 
*/
function filterFiles() {
  app.filesFiltered = app.files.filter(f=>{
    let filter = (app.filter||'').toLowerCase().trim();
    return (
      filter === ''
      || f.file.toLowerCase().includes(filter) 
      || f.desc.toLowerCase().includes(filter)
      || f.type.toLowerCase().includes(filter)
    ) 
  })
}

/**
 * sort dates in inverse order, more recent first
*/
function sortFiles() {
  app.filesFiltered = app.filesFiltered
    .sort( (a,b) => a.date > b.date ? -1 : 1);
}


/**
 * 
*/
async function init() {
  app.user = location.hash.slice(1) || 'drodsou'
  app.files = []
  app.loading = true;
  render()
  
  // app.files = app.files.concat( await getGistsFake() ); // debug
  app.files = app.files.concat( await getGists(app) )
  app.files = app.files.concat( await getRepos(app) )
  
  app.loading = false;
  render()
}

/**
 * render update
*/
function render() {
  filterFiles()
  sortFiles()
  document.getElementById('theFilter').innerHTML = Filter(app)
  document.getElementById('theHeader').innerHTML = Header(app)
  document.getElementById('theTable').innerHTML = Table(app)
 
}



