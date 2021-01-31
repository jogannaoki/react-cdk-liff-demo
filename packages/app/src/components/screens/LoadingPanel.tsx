import * as React from 'react'
import { ActivityIndicator } from 'react-native'
import styles from './LoadingPanel.module.css'
import { COLORS } from '../constants'

interface Props {
  needsToShow: boolean
}

export default function LoadingPanel(props: Props) {
  if (!props.needsToShow) {
    return null
  }

  return (
    <div className={styles.container}>
      <ActivityIndicator animating color={COLORS.WHITE} size="large" />
    </div>
  )
}
