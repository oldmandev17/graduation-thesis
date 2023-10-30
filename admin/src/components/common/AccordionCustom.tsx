import { Accordion, AccordionDetails, AccordionSummary, Typography } from '@mui/material'
import React, { useState } from 'react'
import { MdExpandMore } from 'react-icons/md'

function AccordionCustom({ title, children }: { title: string; children: any }) {
  const [expanded, setExpanded] = useState<string | false>(false)

  const handleChange = (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : false)
  }
  return (
    <div id='accordion-collapse' data-accordion='collapse'>
      <Accordion
        expanded={expanded === 'panel'}
        onChange={handleChange('panel')}
        className='border border-gray-200 rounded-t-xl focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-800 dark:border-gray-700 dark:text-gray-400 dark:bg-gray-800'
      >
        <AccordionSummary expandIcon={<MdExpandMore className='text-gray-500 dark:text-gray-400' />}>
          <Typography>{title}</Typography>
        </AccordionSummary>
        <AccordionDetails className='p-5 border-t border-gray-200 dark:border-gray-700'>{children}</AccordionDetails>
      </Accordion>
    </div>
  )
}

export default AccordionCustom
