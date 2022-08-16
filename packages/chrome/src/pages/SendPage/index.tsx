import classnames from 'classnames';
import React from 'react';
import { Extendable } from '../../types';
import styles from './index.module.scss';

const Title = (props: Extendable) => {
  return (
    <h1 {...props} className={classnames(props.className, styles['title'])} />
  )
}

const SendPage = () => {
  return (
    <div>
      <section>
        <Title>Address</Title>
        <div>
          <input type="textarea" placeholder="Enter SUI address" />
        </div>
      </section>

      <section>
        <Title>Amount</Title>
        <div>
          <input type="number" />
          <div>
            <img src="" alt="sui" />
            <span>SUI</span>
          </div>
          <span>≈ 12 USD</span>
        </div>
      </section>

      <div></div>

      <section>
        <Title>Gas fee</Title>
        <div>
          <img src="" alt="sui" />
        </div>
        <span>0.0012 SUI ≈ 12 USD</span>

        <button>Send</button>
        <button>Cancel</button>
      </section>
    </div>
  )
}

export default SendPage;