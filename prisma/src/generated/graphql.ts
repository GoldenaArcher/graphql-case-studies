import type { GraphQLResolveInfo } from 'graphql';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
export type RequireFields<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
};

export type Comment = {
  __typename?: 'Comment';
  archived?: Maybe<Scalars['Boolean']['output']>;
  author?: Maybe<User>;
  id: Scalars['ID']['output'];
  orphaned?: Maybe<Scalars['Boolean']['output']>;
  post?: Maybe<Post>;
  text: Scalars['String']['output'];
};

export type CommentEvent = {
  __typename?: 'CommentEvent';
  data?: Maybe<Comment>;
  type: EventType;
};

export type CreateCommentInput = {
  author: Scalars['ID']['input'];
  post: Scalars['ID']['input'];
  text: Scalars['String']['input'];
};

export type CreatePostInput = {
  author: Scalars['ID']['input'];
  body: Scalars['String']['input'];
  title: Scalars['String']['input'];
};

export type CreateUserInput = {
  age?: InputMaybe<Scalars['Int']['input']>;
  email: Scalars['String']['input'];
  name: Scalars['String']['input'];
  password: Scalars['String']['input'];
};

export const EventType = {
  Created: 'CREATED',
  Deleted: 'DELETED',
  Updated: 'UPDATED'
} as const;

export type EventType = typeof EventType[keyof typeof EventType];
export type Mutation = {
  __typename?: 'Mutation';
  activateUser: User;
  createComment: Comment;
  createPost: Post;
  createUser: User;
  deleteComment: Scalars['Boolean']['output'];
  deletePost: Scalars['Boolean']['output'];
  deleteUser: Scalars['Boolean']['output'];
  publishPost: Post;
  updateComment: Comment;
  updatePost: Post;
  updateUser: User;
};


export type MutationActivateUserArgs = {
  id: Scalars['ID']['input'];
};


export type MutationCreateCommentArgs = {
  data: CreateCommentInput;
};


export type MutationCreatePostArgs = {
  data: CreatePostInput;
};


export type MutationCreateUserArgs = {
  data: CreateUserInput;
};


export type MutationDeleteCommentArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeletePostArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteUserArgs = {
  id: Scalars['ID']['input'];
};


export type MutationPublishPostArgs = {
  id: Scalars['ID']['input'];
};


export type MutationUpdateCommentArgs = {
  data: UpdateCommentInput;
  id: Scalars['ID']['input'];
};


export type MutationUpdatePostArgs = {
  data: UpdatePostInput;
  id: Scalars['ID']['input'];
};


export type MutationUpdateUserArgs = {
  data: UpdateUserInput;
  id: Scalars['ID']['input'];
};

export type Post = {
  __typename?: 'Post';
  author?: Maybe<User>;
  body: Scalars['String']['output'];
  comments: Array<Maybe<Comment>>;
  id: Scalars['ID']['output'];
  published: Scalars['Boolean']['output'];
  title: Scalars['String']['output'];
};

export type PostEvent = {
  __typename?: 'PostEvent';
  data?: Maybe<Post>;
  type: EventType;
};

export type PostWhereInput = {
  AND?: InputMaybe<Array<PostWhereInput>>;
  NOT?: InputMaybe<Array<PostWhereInput>>;
  OR?: InputMaybe<Array<PostWhereInput>>;
  archive?: InputMaybe<Scalars['Boolean']['input']>;
  body?: InputMaybe<StringFilter>;
  published?: InputMaybe<Scalars['Boolean']['input']>;
  title?: InputMaybe<StringFilter>;
};

export type Query = {
  __typename?: 'Query';
  comments: Array<Maybe<Comment>>;
  me: User;
  post: Post;
  posts: Array<Maybe<Post>>;
  users: Array<Maybe<User>>;
};


export type QueryCommentsArgs = {
  query?: InputMaybe<Scalars['String']['input']>;
};


export type QueryPostArgs = {
  id: Scalars['ID']['input'];
};


export type QueryPostsArgs = {
  where?: InputMaybe<PostWhereInput>;
};


export type QueryUsersArgs = {
  where?: InputMaybe<UserWhereInput>;
};

export const QueryMode = {
  Default: 'default',
  Insensitive: 'insensitive'
} as const;

export type QueryMode = typeof QueryMode[keyof typeof QueryMode];
export type StringFilter = {
  contains?: InputMaybe<Scalars['String']['input']>;
  endsWith?: InputMaybe<Scalars['String']['input']>;
  equals?: InputMaybe<Scalars['String']['input']>;
  mode?: InputMaybe<QueryMode>;
  startsWith?: InputMaybe<Scalars['String']['input']>;
};

export type Subscription = {
  __typename?: 'Subscription';
  comment: CommentEvent;
  count: Scalars['Int']['output'];
  post: PostEvent;
};


export type SubscriptionCommentArgs = {
  postId: Scalars['ID']['input'];
};

export type UpdateCommentInput = {
  archived?: InputMaybe<Scalars['Boolean']['input']>;
  orphaned?: InputMaybe<Scalars['Boolean']['input']>;
  text?: InputMaybe<Scalars['String']['input']>;
};

export type UpdatePostInput = {
  archive?: InputMaybe<Scalars['Boolean']['input']>;
  body?: InputMaybe<Scalars['String']['input']>;
  published?: InputMaybe<Scalars['Boolean']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateUserInput = {
  active?: InputMaybe<Scalars['Boolean']['input']>;
  age?: InputMaybe<Scalars['Int']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
};

export type User = {
  __typename?: 'User';
  active: Scalars['Boolean']['output'];
  age?: Maybe<Scalars['Int']['output']>;
  comments: Array<Maybe<Comment>>;
  email: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  posts: Array<Maybe<Post>>;
};

export type UserWhereInput = {
  AND?: InputMaybe<Array<UserWhereInput>>;
  NOT?: InputMaybe<Array<UserWhereInput>>;
  OR?: InputMaybe<Array<UserWhereInput>>;
  active?: InputMaybe<Scalars['Boolean']['input']>;
  age?: InputMaybe<Scalars['Int']['input']>;
  email?: InputMaybe<StringFilter>;
  name?: InputMaybe<StringFilter>;
};



export type ResolverTypeWrapper<T> = Promise<T> | T;


export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<TResult, TParent = Record<PropertyKey, never>, TContext = Record<PropertyKey, never>, TArgs = Record<PropertyKey, never>> = ResolverFn<TResult, TParent, TContext, TArgs> | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = Record<PropertyKey, never>, TContext = Record<PropertyKey, never>, TArgs = Record<PropertyKey, never>> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = Record<PropertyKey, never>, TContext = Record<PropertyKey, never>> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = Record<PropertyKey, never>, TContext = Record<PropertyKey, never>> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = Record<PropertyKey, never>, TParent = Record<PropertyKey, never>, TContext = Record<PropertyKey, never>, TArgs = Record<PropertyKey, never>> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;





/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
  Boolean: ResolverTypeWrapper<Scalars['Boolean']['output']>;
  Comment: ResolverTypeWrapper<Comment>;
  CommentEvent: ResolverTypeWrapper<CommentEvent>;
  CreateCommentInput: CreateCommentInput;
  CreatePostInput: CreatePostInput;
  CreateUserInput: CreateUserInput;
  EventType: EventType;
  ID: ResolverTypeWrapper<Scalars['ID']['output']>;
  Int: ResolverTypeWrapper<Scalars['Int']['output']>;
  Mutation: ResolverTypeWrapper<Record<PropertyKey, never>>;
  Post: ResolverTypeWrapper<Post>;
  PostEvent: ResolverTypeWrapper<PostEvent>;
  PostWhereInput: PostWhereInput;
  Query: ResolverTypeWrapper<Record<PropertyKey, never>>;
  QueryMode: QueryMode;
  String: ResolverTypeWrapper<Scalars['String']['output']>;
  StringFilter: StringFilter;
  Subscription: ResolverTypeWrapper<Record<PropertyKey, never>>;
  UpdateCommentInput: UpdateCommentInput;
  UpdatePostInput: UpdatePostInput;
  UpdateUserInput: UpdateUserInput;
  User: ResolverTypeWrapper<User>;
  UserWhereInput: UserWhereInput;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  Boolean: Scalars['Boolean']['output'];
  Comment: Comment;
  CommentEvent: CommentEvent;
  CreateCommentInput: CreateCommentInput;
  CreatePostInput: CreatePostInput;
  CreateUserInput: CreateUserInput;
  ID: Scalars['ID']['output'];
  Int: Scalars['Int']['output'];
  Mutation: Record<PropertyKey, never>;
  Post: Post;
  PostEvent: PostEvent;
  PostWhereInput: PostWhereInput;
  Query: Record<PropertyKey, never>;
  String: Scalars['String']['output'];
  StringFilter: StringFilter;
  Subscription: Record<PropertyKey, never>;
  UpdateCommentInput: UpdateCommentInput;
  UpdatePostInput: UpdatePostInput;
  UpdateUserInput: UpdateUserInput;
  User: User;
  UserWhereInput: UserWhereInput;
};

export type CommentResolvers<ContextType = any, ParentType extends ResolversParentTypes['Comment'] = ResolversParentTypes['Comment']> = {
  archived?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  author?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  orphaned?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  post?: Resolver<Maybe<ResolversTypes['Post']>, ParentType, ContextType>;
  text?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
};

export type CommentEventResolvers<ContextType = any, ParentType extends ResolversParentTypes['CommentEvent'] = ResolversParentTypes['CommentEvent']> = {
  data?: Resolver<Maybe<ResolversTypes['Comment']>, ParentType, ContextType>;
  type?: Resolver<ResolversTypes['EventType'], ParentType, ContextType>;
};

export type MutationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = {
  activateUser?: Resolver<ResolversTypes['User'], ParentType, ContextType, RequireFields<MutationActivateUserArgs, 'id'>>;
  createComment?: Resolver<ResolversTypes['Comment'], ParentType, ContextType, RequireFields<MutationCreateCommentArgs, 'data'>>;
  createPost?: Resolver<ResolversTypes['Post'], ParentType, ContextType, RequireFields<MutationCreatePostArgs, 'data'>>;
  createUser?: Resolver<ResolversTypes['User'], ParentType, ContextType, RequireFields<MutationCreateUserArgs, 'data'>>;
  deleteComment?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationDeleteCommentArgs, 'id'>>;
  deletePost?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationDeletePostArgs, 'id'>>;
  deleteUser?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationDeleteUserArgs, 'id'>>;
  publishPost?: Resolver<ResolversTypes['Post'], ParentType, ContextType, RequireFields<MutationPublishPostArgs, 'id'>>;
  updateComment?: Resolver<ResolversTypes['Comment'], ParentType, ContextType, RequireFields<MutationUpdateCommentArgs, 'data' | 'id'>>;
  updatePost?: Resolver<ResolversTypes['Post'], ParentType, ContextType, RequireFields<MutationUpdatePostArgs, 'data' | 'id'>>;
  updateUser?: Resolver<ResolversTypes['User'], ParentType, ContextType, RequireFields<MutationUpdateUserArgs, 'data' | 'id'>>;
};

export type PostResolvers<ContextType = any, ParentType extends ResolversParentTypes['Post'] = ResolversParentTypes['Post']> = {
  author?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  body?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  comments?: Resolver<Array<Maybe<ResolversTypes['Comment']>>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  published?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
};

export type PostEventResolvers<ContextType = any, ParentType extends ResolversParentTypes['PostEvent'] = ResolversParentTypes['PostEvent']> = {
  data?: Resolver<Maybe<ResolversTypes['Post']>, ParentType, ContextType>;
  type?: Resolver<ResolversTypes['EventType'], ParentType, ContextType>;
};

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  comments?: Resolver<Array<Maybe<ResolversTypes['Comment']>>, ParentType, ContextType, Partial<QueryCommentsArgs>>;
  me?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  post?: Resolver<ResolversTypes['Post'], ParentType, ContextType, RequireFields<QueryPostArgs, 'id'>>;
  posts?: Resolver<Array<Maybe<ResolversTypes['Post']>>, ParentType, ContextType, Partial<QueryPostsArgs>>;
  users?: Resolver<Array<Maybe<ResolversTypes['User']>>, ParentType, ContextType, Partial<QueryUsersArgs>>;
};

export type SubscriptionResolvers<ContextType = any, ParentType extends ResolversParentTypes['Subscription'] = ResolversParentTypes['Subscription']> = {
  comment?: SubscriptionResolver<ResolversTypes['CommentEvent'], "comment", ParentType, ContextType, RequireFields<SubscriptionCommentArgs, 'postId'>>;
  count?: SubscriptionResolver<ResolversTypes['Int'], "count", ParentType, ContextType>;
  post?: SubscriptionResolver<ResolversTypes['PostEvent'], "post", ParentType, ContextType>;
};

export type UserResolvers<ContextType = any, ParentType extends ResolversParentTypes['User'] = ResolversParentTypes['User']> = {
  active?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  age?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  comments?: Resolver<Array<Maybe<ResolversTypes['Comment']>>, ParentType, ContextType>;
  email?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  posts?: Resolver<Array<Maybe<ResolversTypes['Post']>>, ParentType, ContextType>;
};

export type Resolvers<ContextType = any> = {
  Comment?: CommentResolvers<ContextType>;
  CommentEvent?: CommentEventResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  Post?: PostResolvers<ContextType>;
  PostEvent?: PostEventResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  Subscription?: SubscriptionResolvers<ContextType>;
  User?: UserResolvers<ContextType>;
};

