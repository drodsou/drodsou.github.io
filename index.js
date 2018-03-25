var app = {
  user : '',
  files : [],
  filter : '',
  filesFiltered : [],
  set : function(prop, value) {
    this[prop] = value
    render()
  }
}


async function fetchGet (url, fetchTransform='json') {
  let response = await fetch( url, {method: 'GET', mode: 'cors'})
  
  let headersObj = {}
  for (var pair of response.headers.entries()) {
    headersObj[pair[0]] = pair[1]
  }

  if (!response.ok) { 
      return {error:response.status, headers:headersObj, body:null} 
  }
  else { 
      let body = await response[fetchTransform]()
      return {error:null, headers:headersObj, body:body } 
  }
}


/**
 * 
 */
async function getGists() {
  // If 403 forbidden because of rate limite, see: curl -i https://api.github.com/users/octocat
  var url = `https://api.github.com/users/${app.user}/gists?per_page=100`  // ?per_page=100
  var files = []  // all results after pagination

  while (url) {
      var response = await fetchGet(url)
      response.body.forEach( f => files.push( {
              file : Object.keys(f.files)[0],  
              url : f.html_url,  
              desc : f.description || '',
              date : f.updated_at.slice(0,10),
              type : 'gist'
          })
      ) 

      // more pages remaining, acording to github api?
      url = undefined
      if (app.user === 'drodsou' && response.headers.link) {
          let linkArr = (response.headers.link).replace(/</g,'').replace(/>/g,'').replace(/,/g,';').split(';').map(e=>e.trim())
          if (linkArr[1] === 'rel="next"')  {
              url = linkArr[0]
          }
      }
  } // while

  return files
} // get hists

/**
 * 
 */
async function getGistsFake() {
  return [
    {file:'some gist 2', url:'#', desc:'platinum', date:'20180102',type:'gist'},
    {file:'some gist 3', url:'#', desc:'just plate', date:'20180103',type:'repo'},
    {file:'some gist 1', url:'#', desc:'golden', date:'20180101', type:'gist'},
  ]
}




/**
 * 
 */
async function getRepos() {
  // If 403 forbidden because of rate limite, see: curl -i https://api.github.com/users/octocat
  var url = `https://api.github.com/users/${app.user}/repos?per_page=100`  //?per_page=30
  var files = []  // all results after pagination

  while (url) {
      var response = await fetchGet(url)
      response.body.forEach( f => files.push( {
              file : f.name,  
              url : f.html_url,  
              desc : f.description || '',
              date : f.updated_at.slice(0,10),
              type : 'repo'
          })
      ) 

      // more pages remaining, acording to github api?
      url = undefined
      if ( app.user === 'drodsou' && response.headers.link) {
          let linkArr = (response.headers.link).replace(/</g,'').replace(/>/g,'').replace(/,/g,';').split(';').map(e=>e.trim())
          if (linkArr[1] === 'rel="next"')  {
              url = linkArr[0]
          }
      }
  } // while

  return files
} // get hists







/**
 * Component
 */
function Table() {
  let files = app.filesFiltered
  
  var str = (`<table>`)

  files.forEach(f=>{
    str += (`
        <tr class="file" onClick="window.open('${f.url}','_blank')"> 
          <td style="font-size:0.9rem;color:#aaa;width:90px;">${f.date}</td> 
          <td><b>${f.file}</b></td> 
          <td>${f.desc}</td> 
          <td>${f.type}</td> 
        </tr>
    `)
  })
  str += '</table>'
  return str
}

/**
 * Component
 */
function Header() {
  let files = app.filesFiltered
  return `${app.user} @ github (${files.length})`
}

/**
 * Component
 */

function Filter() {
  let str = `
    <div style="position:relative; top:-10px;">
      <span id="theFilter" contenteditable="true" style="
         display:inline-block; width:200px; text-align:center; outline-width:0px;
         border:1px solid #aaa; border-radius:12px; padding-bottom:2px;
      "></span>
      <img style="height:16px;position:relative; left:-22px;top:3px;" 
        src="https://storage.googleapis.com/material-icons/external-assets/v4/icons/svg/ic_search_black_24px.svg"
      ></img>
    </div>
  `
  setTimeout(()=>{
    let theFilter = document.getElementById('theFilter')
    theFilter.addEventListener('keyup',(ev)=>{
      app.set('filter', theFilter.innerHTML)
    })
    theFilter.focus()
  },1)

  return str
}



function filterFiles() {
  app.filesFiltered = app.files.filter(f=>{
    return (
      !app.filter 
      || f.file.toLowerCase().includes(app.filter.toLowerCase()) 
      || f.desc.toLowerCase().includes(app.filter.toLowerCase())
      || f.type.toLowerCase().includes(app.filter.toLowerCase())
    ) 
  })
}

function sortFiles() {
  app.filesFiltered = app.filesFiltered.sort( (a,b) => {
    return a.date < b.date ? 1 : -1
  })
}

function render() {
  filterFiles()
  sortFiles()
  document.getElementById('theHeader').innerHTML = Header()
  document.getElementById('theTable').innerHTML = Table()
  
}


async function firstRender() {
  app.user = location.hash.slice(1) || 'drodsou'
  //app.files = await getGistsFake()    // dev mode
  app.files = []
  //app.files = app.files.concat( await getGistsFake() )
  app.files = app.files.concat( await getGists() )
  app.files = app.files.concat( await getRepos() )
  render()
}


/**
 *  Main
 */
document.getElementById('theFilter').outerHTML = Filter()
window.addEventListener('hashchange',firstRender)
firstRender()
