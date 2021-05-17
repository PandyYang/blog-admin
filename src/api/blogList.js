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

export  const deleteArticleById=(articleId)=>{
  return request({
    url: "/article/deleteArticleById",
    method: "delete",
    params:{
      articleId
    }
  })
}
