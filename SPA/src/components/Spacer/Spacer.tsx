interface SpacerProps {
  customStyles?: CSSStyleRule
}

export const Spacer = ({ customStyles }: SpacerProps) => {
  const styles = { paddingBottom: '130px', ...customStyles }
  return <div style={styles} />
}
