import React, { useState } from 'react'
import { Container, GridRow, GridColumn, Grid, Image } from 'semantic-ui-react'
import DatePickerComponent from './DatePickerComponent';

function Demo() {
    const [startDate, setStartDate] = useState<Date | null>(new Date);

    return (
        <Container>
            <Grid columns={5} divided inverted>
                <GridRow>
                    <GridColumn>
                        <DatePickerComponent
                            label='Start'
                            selectedDate={startDate}
                            onDateChange={(date: any) => {
                                setStartDate(date)
                            }} />
                    </GridColumn>
                    <GridColumn>
                        <Image src='https://react.semantic-ui.com/images/wireframe/media-paragraph.png' />
                    </GridColumn>
                    <GridColumn>
                        <Image src='https://react.semantic-ui.com/images/wireframe/media-paragraph.png' />
                    </GridColumn>
                    <GridColumn>
                        <Image src='https://react.semantic-ui.com/images/wireframe/media-paragraph.png' />
                    </GridColumn>
                    <GridColumn>
                        <Image src='https://react.semantic-ui.com/images/wireframe/media-paragraph.png' />
                    </GridColumn>
                </GridRow>
            </Grid>
        </Container>
    )

}

export default Demo