import { useEffect, useState } from 'react'

import BookImage from '_Images/book.webp'
import CartImage from '_Images/cart.webp'

import styles from './Slider.styl'

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
  const [currentIndex, setCurrentIndex] = useState(0)
  const [currentContent, setCurrentContent] = useState(sliderContent[currentIndex])

  const nextSlide = () => {
    let next = currentIndex + 1
    if (next >= sliderContent.length) {
      next = 0
    }
    setCurrentIndex(next)
  }

  useEffect(() => {
    setCurrentContent(sliderContent[currentIndex])
  }, [currentIndex])

  useEffect(() => {
    const interval = setInterval(nextSlide, 4000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className={styles.Slider}>
      <div className="slider">
        <div className="image">
          <img src={currentContent.image} alt="hero" />
        </div>
        <div className="header">{currentContent.title}</div>
        <div className="description">{currentContent.description}</div>
        <div>dots </div>
      </div>
    </div>
  )
}
