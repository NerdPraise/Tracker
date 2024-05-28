import { useEffect, useState } from 'react'
import ClassNames from 'classnames'

import BookImage from '_Images/book.webp'
import CartImage from '_Images/cart.webp'

import styles from './Slider.module.styl'

const sliderContent = [
  {
    title: 'Easy To Navigate Tracking',
    description: 'Welcome to the tracker god, where all your tracking can be done.',
    image: BookImage,
  },
  {
    title: 'Easy To Navigate Tracking 2',
    description: 'Welcome to the tracker god, where all your tracking can be done.2',
    image: CartImage,
  },
  {
    title: 'Easy To Navigate Tracking 3',
    description: 'Welcome to the tracker god, where all your tracking can be done.3',
    image: '',
  },
]

export const Slider = () => {
  const [currentIndex, setCurrentIndex] = useState<number>(0)

  useEffect(() => {
    const interval = setInterval(
      () => setCurrentIndex((prev) => (prev < sliderContent.length - 1 ? prev + 1 : 0)),
      3000,
    )

    return () => clearInterval(interval)
  }, [])

  return (
    <div className={styles.Slider}>
      {sliderContent.map((item, index) => (
        <div
          className={ClassNames(styles.slider_item_content, { [styles.active]: index === currentIndex })}
          key={index}
        >
          <div className={styles.image}>
            <img src={item.image} alt="hero" />
          </div>
          <div className={styles.slider_item_title}>{item.title}</div>
          <div className={styles.slider_item_description}>{item.description}</div>
          <div>dots</div>
        </div>
      ))}
    </div>
  )
}
