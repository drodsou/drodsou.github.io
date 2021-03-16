import {getGithub, getGithubFake, fetchGet } from './github.js';
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
  loading : true,
  debug : false
}

// debug
if (app.debug) window.app = app;

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
      || (f.file||'').toLowerCase().includes(filter) 
      || (f.desc||'').toLowerCase().includes(filter)
      || (f.type||'').toLowerCase().includes(filter)
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
  
  if (app.debug) { 
    app.files = app.files.concat( await getGithubFake() ); 
  }
  else {
    app.files = app.files.concat( await getGithub(app, 'gist') );
    app.files = app.files.concat( await getGithub(app, 'repo') );
  }
  
  app.loading = false;
  render()
}

/**
 * render update
*/
function render() {
  filterFiles()
  sortFiles()
  Filter(app, document.getElementById('theFilter'));
  Header(app, document.getElementById('theHeader'));
  Table(app, document.getElementById('theTable'));
}



