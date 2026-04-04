export const CommentType={
  POST:'post',
  HOME:'home'
}

export type CommentTypes=(typeof CommentType)[keyof typeof CommentType]