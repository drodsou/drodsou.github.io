/**
 * helper function
 * returns {error:int, headers:object, body:object}
*/
export async function fetchGet (url, fetchTransform='json') {
  let response = await fetch( url, {method: 'GET', mode: 'cors'})
  
  // -- iterator to plain object
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
 * debug helper
 */
export async function getGithubFake() {
  await new Promise(resolve=>setTimeout(resolve,2000));
  
  return [
    {file:'second', url:'#', desc:'the two', date:'20180102',type:'gist'},
    {file:'third', url:'#', desc:'the three', date:'20180103',type:'repo'},
    {file:'first', url:'#', desc:'one', date:'20180101', type:'gist'},
  ]
}


/**
 * get gists or repos from github API
 * @param {'repo' | 'gist'} repoOrGist
 */
 export async function getGithub(app, repoOrGist) {
  // If 403 forbidden because of rate limite, see: curl -i https://api.github.com/users/octocat
  var url = `https://api.github.com/users/${app.user}/${repoOrGist}s?per_page=100`  //?per_page=30
  var files = []  // all results after pagination

  while (url) {
      var response = await fetchGet(url)
      response.body.forEach( f => files.push( {
              file : repoOrGist === 'repo' ? f.name : Object.keys(f.files)[0],  
              url : f.html_url,  
              desc : f.description || '',
              date : f.updated_at.slice(0,10),
              type : repoOrGist
          })
      ) 

      // more pages remaining, acording to github api?
      url = undefined
      if ( response.headers.link) {
          let linkArr = (response.headers.link).replace(/</g,'').replace(/>/g,'').replace(/,/g,';').split(';').map(e=>e.trim())
          if (linkArr[1] === 'rel="next"')  {
              url = linkArr[0]
          }
      }
  } // while

  return files
} 