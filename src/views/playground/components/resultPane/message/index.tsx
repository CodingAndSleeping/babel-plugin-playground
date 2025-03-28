import { FC, useEffect, useState } from 'react';
import cn from 'classnames';
import styles from './index.module.scss';

export interface MessageProps {
  type: 'error' | 'warn';
  content: string;
}

const Message: FC<MessageProps> = ({ type, content }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(!!content);
  }, [content]);

  return visible ? (
    <div className={cn(styles.message, styles[type])}>
      <pre
        dangerouslySetInnerHTML={{
          __html: content,
        }}
      ></pre>
    </div>
  ) : null;
};

export default Message;
