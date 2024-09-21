import { useEffect, useState } from 'react'
import ClassNames from 'classnames'

import Man from '_Images/man.svg'
import Innovation from '_Images/innovation.svg'
import Puzzle from '_Images/puzzle.svg'

import styles from './Slider.module.styl'

const sliderContent: Partial<Record<'image' | 'title' | 'description', string>>[] = [
  {
    image: Man,
  },
  {
    image: Innovation,
  },
  {
    image: Puzzle,
  },
]

export const Slider = ({ className }: { className?: string }) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0)

  useEffect(() => {
    const interval = setInterval(
      () => setCurrentIndex((prev) => (prev < sliderContent.length - 1 ? prev + 1 : 0)),
      3000,
    )

    return () => clearInterval(interval)
  }, [])

  return (
    <div className={ClassNames(styles.Slider, className)}>
      {sliderContent.map((item, index) => (
        <div
          className={ClassNames(styles.slider_item_content, { [styles.active]: index === currentIndex })}
          key={index}
        >
          <div className={styles.image}>
            <img src={item.image} alt="hero" />
          </div>
          <div className={styles.slider_item_details}>
            <div className={styles.slider_item_title}>{item?.title}</div>
            <div className={styles.slider_item_description}>{item?.description}</div>
          </div>
        </div>
      ))}
      <div className={styles.dot_container}>
        {sliderContent.map((item, index) => (
          <div
            className={ClassNames(styles.dot, { [styles.active]: index === currentIndex })}
            key={index}
          />
        ))}
      </div>
    </div>
  )
}
