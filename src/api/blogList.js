import request from "../utils/request"

export  const listArticle=(current,size,title)=>{
  return request({
    url: "/article/listArticle",
    method: "get",
    params:{
      current,
      size,
      title,
    }
  })
}

export const deleteArticles=(str)=>{
  return request({
    url: "/article/deleteArticles",
    method: "delete",
    data: str
  })
}
