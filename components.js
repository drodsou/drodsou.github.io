/**
 * Component
 */
 export function Header(app) {
  let files = app.filesFiltered
  return `${app.user} @ github (${files.length})`
}

/**
 * Component
 */
export function Filter(app) {
  let iconSearch = "https://storage.googleapis.com/material-icons/external-assets/v4/icons/svg/ic_search_black_24px.svg"
  let iconLoading = "https://storage.googleapis.com/material-icons/external-assets/v4/icons/svg/ic_sync_black_24px.svg"
  let str = `
    <div id="theFilter">
      <style>
        #theFilter {
          style="position:relative; 
          top:-10px; 
          outline-width:0px;
        }

        #theFilter input {
          width:200px; height:24px; 
          text-align:center; outline-width:0px;
          border:1px solid #aaa; border-radius:12px; 
          padding-bottom:2px;
          font-size: 18px;
        }
        #theFilter input:focus {
          outline: none;
        }

        #theFilter img {
          position:relative; 
          left:-33px; top:4px;
          height:20px; 
        }

        .rotate {
          animation: rotate-anim 2s infinite linear;
        }

        @keyframes rotate-anim {
          from {transform: rotate(0deg); }
          to { transform: rotate(-359deg); }
        }
      </style>
      <input />
      <img  
        class="${app.loading ? 'rotate' : ''}"
        src="${app.loading ? iconLoading : iconSearch}"
      ></img>
    </div>
  `
  setTimeout(()=>{
    let theFilterInput = document.querySelector('#theFilter input')
    theFilterInput.addEventListener('keyup',(ev)=>{
      app.set('filter', theFilterInput.value)
    })
    theFilterInput.focus()
  },1)

  return str
}


/**
 * Component
 */
export function Table(app) {
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




