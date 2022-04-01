import React from 'react';

import Button from '../../Button/Button';
import './Post.css';

const post = props => (
  <article className="post">
    <header className="post__header">
      <h3 className="post__meta">
        {props.questionid}
      </h3>
      <h1 className="post__title">{props.description}</h1>
    </header>
    <div className="post__content">{props.content}</div>
    <div className="post__actions">
      <Button mode="flat" link={props.answerid}>
        View
      </Button>
    </div>
  </article>
);

export default post;
