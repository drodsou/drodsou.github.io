var app = {
  files : [],
  filter : '',
  filesFiltered : [],
  set : function(prop, value) {
    this[prop] = value
    render()
  }
}

/**
 * 
 */
async function getGists() {
  var url = 'https://api.github.com/users/drodsou/gists'  //?per_page=15
  var files = []  // all results after pagination

  while (url) {
      var response = await getURLP(url)
      var text = JSON.parse(response.text)
      text.forEach( f => files.push( {
              file : Object.keys(f.files)[0],  
              url : f.html_url,  
              desc : f.description,
              date : f.updated_at
          })
      ) 

      // more pages remaining, acording to github api?
      //console.log('response 1', response.headers.link)
      url = undefined
      if (response.headers.linkXXX) {
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
        <tr class="file" onClick="window.document.location='${f.url}'"> 
        <td style="font-size:0.9rem;color:#aaa;">${f.date}</td> 
            <td><b>${f.file}</b></td> 
            <td>${f.desc}</td> 
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
  return `drodsou's Gists (${files.length})`
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


/**
 *  Main
 */
(async function main() {
  app.files = await getGists()
  document.getElementById('theFilter').outerHTML = Filter()
  render()
})().then( ()=>console.log("started") )