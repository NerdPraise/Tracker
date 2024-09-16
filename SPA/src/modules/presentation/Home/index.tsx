import { useRef } from 'react'
import ClassNames from 'classnames'
import { Link, useNavigate } from 'react-router-dom'
import { CircleCheckBig } from 'lucide-react'

import { Button, Nav, Card } from '_Home/components'
import InvoiceDash from '_Images/invoice.png'
import { ROUTES } from '_Home/routing/routes'
import { plans } from '_Home/constants'

import { features } from './constants'
import styles from './Home.module.styl'

const generateDots = (count) => {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    top: Math.random() * 100,
    duration: 3 + Math.random() * 10,
    delay: Math.random() * 5,
  }))
}

const Home = () => {
  const refs = useRef<HTMLDivElement[]>([])
  const setRef = (element, index) => {
    refs.current[index] = element // Assign element to the specific index
  }
  const navigate = useNavigate()

  const handleMouseMove = (e: React.MouseEvent, index: number) => {
    const targetElement = refs.current[index]
    const { left, top } = targetElement.getBoundingClientRect()
    const x = e.clientX - left
    const y = e.clientY - top

    let deg = ((470 - y) / 470) * 180
    if (x > 305 / 2) {
      deg = 360 - deg
    }
    targetElement.style.setProperty('--deg', `${deg}deg`)
  }

  return (
    <div className={styles.Home}>
      <Nav />
      <div className={styles.home__hero}>
        <div className={styles.floating_dots}>
          {generateDots(20).map((dot) => (
            <div
              key={dot.id}
              className={styles.dot}
              style={{
                left: `${dot.left}%`,
                animationDuration: `${dot.duration}s`,
                animationDelay: `${dot.delay}s`,
              }}
            />
          ))}
        </div>
        <div className={styles.hero_content}>
          <h1>Streamline Your Invoicing with Ease</h1>
          <p>Create, Send, and Manage Invoices in Seconds – Get Paid Faster!</p>
          <Link to={ROUTES.unauthenticatedRoutes.SIGNUP.path}>
            <Button className={styles.hero__btn} onClick={null} text="Get started" />
          </Link>
          <div className={styles.hero__dash}>
            <img src={InvoiceDash} alt="Invoice Dashboard" />
            <div className={styles.hero_fade}></div>
          </div>
        </div>
      </div>
      <div className={styles.home__features}>
        <h3 id="features">FEATURES</h3>
        <div className={styles.home__features_cards}>
          {features.slice(0, 2).map((item) => (
            <Card
              title={item.title}
              className={styles.features__card}
              headerClassname={styles.card__header}
            >
              <div>{item.description}</div>
            </Card>
          ))}

          <Card
            title={features[4].title}
            className={styles.features__card_large}
            headerClassname={styles.card__header}
          >
            <div>{features[4].description}</div>
          </Card>

          {features.slice(2, 4).map((item) => (
            <Card
              title={item.title}
              className={styles.features__card}
              headerClassname={styles.card__header}
            >
              <div>{item.description}</div>
            </Card>
          ))}
        </div>
      </div>
      <div className={styles.home_pricing} id="pricing">
        <div className={styles.pricing_header}>
          <h3>Equip yourself with world class software</h3>
          <p className="small">Unlock all endless possibilites - pricing that works for everyone</p>
        </div>
        <div className={styles.pricing_cards}>
          {plans.map((item, index) => (
            <Card
              className={styles.pricing_card}
              childrenClassName={styles.children}
              onMouseMove={(e) => handleMouseMove(e, index)}
              ref={(el) => setRef(el, index)}
            >
              {item.name === 'Premium' && <div className={styles.recommended}>POPULAR</div>}
              <h5>{item.name}</h5>
              <p className="small">{item.description}</p>
              <div className={styles.price}>
                <span>$</span>
                &nbsp;{item.price}
              </div>
              <Button
                onClick={() => navigate('/register?rdr=subscribe')}
                text="Get started"
                className={styles.pricing_btn}
              />
              {item.offers.slice(0, 4).map((offer) => (
                <div className={ClassNames('small', styles.list_item)}>
                  <CircleCheckBig />
                  {offer}
                </div>
              ))}
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
export default Home
