import { useRef } from 'react'
import ClassNames from 'classnames'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowUpRight, CircleCheckBig } from 'lucide-react'
import { motion } from 'framer-motion'
import CountUp from 'react-countup'

import { Button, Nav, Card } from '_Home/components'
import { ROUTES } from '_Home/routing/routes'
import { plans, steps } from '_Home/constants'
import InvoiceDash from '_Images/invoice.svg'
import PaidInvoice from '_Images/iluss.svg'

import { features } from './constants'
import styles from './Home.module.styl'

const generateDots = (count: number) => {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    top: Math.random() * 100,
    duration: 3 + Math.random() * 10,
    delay: Math.random() * 5,
  }))
}
const bounce = {
  animate: {
    y: [5, -6, 5],
    transition: {
      duration: 1.8,
      ease: 'easeInOut',
      repeat: Infinity,
    },
  },
}

const Home = () => {
  const refs = useRef<HTMLDivElement[]>([])
  const setRef = (element, index) => {
    refs.current[index] = element
  }
  const scrollRef = useRef<HTMLDivElement>(null)
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
    <div className={styles.Home} ref={scrollRef}>
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
          <div className={styles.hero_content_light}>
            <div className={styles.hero_content_light_item} />
            <div className={styles.hero_content_light_item} />
            <div className={styles.hero_content_light_item} />
            <div className={styles.hero_content_light_item} />
            <div className={styles.hero_content_light_item} />
            <div className={styles.hero_content_light_item} />
          </div>
          <div className={styles.hero_content_item}>
            <h1>Streamline Your Invoicing with Ease</h1>
            <p>Create, Send, and Manage Invoices in Seconds – Get Paid Faster!</p>
            <Link to={ROUTES.unauthenticatedRoutes.SIGNUP.path}>
              <Button className={styles.hero__btn} onClick={null} text="Get started for free" />
            </Link>
            <div className={styles.hero__dash}>
              <img id="full" src={InvoiceDash} alt="Invoice Dashboard" loading="lazy" height={1} />
              <div className={styles.hero_fade}></div>
            </div>
          </div>
        </div>
      </div>

      <motion.section
        className={styles.why}
        initial={{ opacity: 0, transform: 'translateY(50px)' }}
        whileInView={{ opacity: 1, transform: 'translateY(0)' }}
        viewport={{ root: scrollRef, amount: 0.2 }}
      >
        <h5>WHY US?</h5>
        <h2>
          Why you should use&nbsp;
          <motion.span
            style={{
              display: 'inline-flex',
              color: '#993ad5',
            }}
            variants={bounce}
            animate="animate"
          >
            USEINVOICE
          </motion.span>
        </h2>
        <div className={styles.why_cards}>
          <div className={styles.half}>
            <Card childrenClassName={styles.card_children}>
              <div className={styles.info}>
                <p>
                  <CountUp end={10} enableScrollSpy duration={8} scrollSpyOnce />+
                </p>
                <p>Fully customisable invoices</p>
              </div>
            </Card>
            <Card childrenClassName={styles.card_children}>
              <div className={styles.invoice_paid}>
                <p>Auto-billing & Recurring Invoices coupled with client side payment</p>
                <div>
                  <img src={PaidInvoice} />
                </div>
              </div>
            </Card>
          </div>
          <div className={styles.full}>
            <Card childrenClassName={styles.card_children}>
              <div className={styles.report}>
                <p>Finance reporting</p>
                <img src="" alt="" />
              </div>
            </Card>
          </div>
        </div>
      </motion.section>

      <section className={styles.steps}>
        <h5>STEPS</h5>
        <h2>Minimise effort, customise branding and reserve a system that works for you</h2>
        <div className={styles.list_steps}>
          {steps.map((item, ind) => (
            <Card childrenClassName={styles.step_card_children}>
              <p className={styles.step_number}>{ind + 1}</p>
              <div className={styles.header}>{item.title}</div>
              <div className={styles.desc}>{item.desc}</div>
            </Card>
          ))}
        </div>
      </section>

      <section className={styles.goals}>
        <h5>OUR GOAL</h5>
        <h2>Simplify, Automate and Ease invoice transportation</h2>
        <p>
          Our service is built to tailor towards any and every audience from SMEs to Freelancers across
          all industries
        </p>
        <div className={styles.insights}>
          <div>
            <p>
              <CountUp end={69} enableScrollSpy duration={2} scrollSpyOnce />%
            </p>
            <p>Enhanced productivity</p>
          </div>
          <div>
            <p>
              <CountUp end={100} enableScrollSpy duration={2} scrollSpyOnce />%
            </p>
            <p>Improvement on every other invoicing system</p>
          </div>
          <div>
            <p>0</p>
            <p>Starting cost</p>
          </div>
        </div>
        <section className={styles.home_pricing} id="pricing">
          <p className="small">CHOOSE PLAN - Unlock all endless possibilites</p>
          <div className={styles.pricing_cards}>
            {plans.map((item, index) => (
              <Card
                key={item.name}
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
                  &nbsp;{item.price.toFixed(2)}
                </div>
                <Button
                  onClick={() => navigate('/register?rdr=subscribe')}
                  text="Get started"
                  className={styles.pricing_btn}
                />
                {item.offers.slice(0, 4).map((offer) => (
                  <div className={ClassNames('small', styles.list_item)} key={offer}>
                    <CircleCheckBig />
                    {offer}
                  </div>
                ))}
              </Card>
            ))}
          </div>
        </section>

        <Card className={styles.action}>
          <div className={styles.middle_set}>
            <h5>TRY IT NOW</h5>
            <div className={styles.call}>
              <div>
                <h2>Ready to level up your invoice game?</h2>
                <p>
                  Supports small business with simple invoicing solution, powerful integrations and
                  flexible branding management
                </p>
              </div>
              <div className={styles.btn_group}>
                <Button className={styles.hero__btn} onClick={null} text="Get started" />
                <Button
                  className={styles.hero__btn}
                  onClick={null}
                  logo={<ArrowUpRight size={18} />}
                  text="Learn more"
                />
              </div>
            </div>
          </div>
        </Card>
      </section>

      {/* <motion.div
        className={styles.home__features}
        initial={{ opacity: 0, transform: 'translateY(50px)' }}
        whileInView={{ opacity: 1, transform: 'translateY(0)' }}
        viewport={{ root: scrollRef, amount: 0.15 }}
      >
        <h3 id="features">FEATURES</h3>
        <div className={styles.home__features_cards}>
          {features.slice(0, 2).map((item) => (
            <Card
              title={item.title}
              className={styles.features__card}
              headerClassname={styles.card__header}
              key={item.title}
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
              key={item.title}
            >
              <div>{item.description}</div>
            </Card>
          ))}
        </div>
      </motion.div> */}
    </div>
  )
}
export default Home
