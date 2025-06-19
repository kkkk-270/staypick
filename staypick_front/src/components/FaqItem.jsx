import React, { useState } from 'react';
import '../css/FaqItem.css';

const FaqItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleAnswer = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="faq-item">
      <div className="faq-question" onClick={toggleAnswer}>
        <span>{question}</span>
        <span className="arrow">{isOpen ? '∧' : '∨'}</span>
      </div>
      {isOpen && (
        <div className="faq-answer">
          <div className="answer-box">
          {answer}
          </div>
        </div>
      )}
    </div>
  );
};

export default FaqItem;
