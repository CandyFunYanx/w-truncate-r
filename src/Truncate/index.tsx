import React, { FC, useEffect, useState, useRef } from 'react';
import classNames from 'classnames';
import './index.scss';

interface TruncateProps {
  className?: string;
  style?: object;
  content: string;
  width?: number;
  line?: number;
  showBtn?: boolean;
}

const Truncate: FC<TruncateProps> = ({
  className,
  style,
  content,
  width,
  line = 2,
  showBtn = true
}) => {
  const classes = classNames('Truncate', className);
  const containerRef = useRef(null);
  const [showContent, setShowContent] = useState(content);
  // 初始状态能显示的文本
  const [oContent, setOContent] = useState('');
  const [showAll, setShowAll] = useState(false);
  const [hasTruncateBtn, setHasTruncateBtn] = useState(false);

  // 判断当前的container宽高，能放下多少个字符
  function charCountFitInWith(containerWidth: number, font: string, content: string): any {
    const oCanvas = document.createElement('canvas');
    const ctx = oCanvas.getContext('2d') as CanvasRenderingContext2D;
    ctx.font = font;
    const textWidth = ctx.measureText(content).width;
    console.log(textWidth, (containerWidth), content);
    let flag = 1;
    oCanvas.remove();
    if(textWidth > containerWidth) {
      return charCountFitInWith(containerWidth, font, content.substring(0, content.length - (flag++)))
    } else {
      return content;
    }
  }

  useEffect(() => {
    if(containerRef.current) {
      const container = containerRef.current;
      console.log(container, 'container')
      const style = window.getComputedStyle(container);
      console.log(style, 'style')
      const font = style.font;
      const containerWidth = style.width;
      // 获取content的方框的宽度和字体
      console.log(font, containerWidth);

      // 判断所有的文字长度是否大于container的宽度*line，如果是就需要展开按钮，不是就隐藏
      const oDiv = document.createElement('div');
      oDiv.style.font = font;
      oDiv.style.display = 'inline-block';
      oDiv.innerText = content;
      document.body.appendChild(oDiv);
      const contentStyle = window.getComputedStyle(oDiv);
      console.log(parseInt(contentStyle.width));
      if(parseInt(contentStyle.width) > parseInt(containerWidth) * line - 20) {
        setHasTruncateBtn(true && showBtn);
      }

      const str = charCountFitInWith(parseInt(containerWidth) * line - 100, font, content)
      setOContent(str);
      console.log(str)
      setShowContent((parseInt(contentStyle.width) > (parseInt(containerWidth) * line - 20)) && !showAll ? str+'...' : str)

      oDiv.remove();
    }
  }, [])

  const handleClick = () => {
    setShowContent(showAll ? oContent+'...' : content);
    setShowAll(!showAll);
  }

  return (
    <div className={classes} style={{...style}} >
      <div className='truncate-content' ref={containerRef}>{showContent}</div>
      {
        hasTruncateBtn && <span className='truncate-btn' onClick={handleClick}>{showAll ? '收起' : '展开'}</span>
      }
    </div>
  )
}

export default Truncate;