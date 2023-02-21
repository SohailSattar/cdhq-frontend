/* eslint-disable import/no-anonymous-default-export */
import React from 'react';

import { Tab, TabList, TabPanel, Tabs } from '.';

export default {
    title: 'Components/Tabs',
    component: Tabs,
};

export const Primary = () => (
    <Tabs>
        <TabList>
            <Tab>Title 1</Tab>
            <Tab>Title 2</Tab>
            <Tab>Title 3</Tab>
            <Tab>Title 4</Tab>
            <Tab>Title 5</Tab>
            <Tab>Title 6</Tab>
        </TabList>

        <TabPanel>
            <h2>Any content 🇬🇪 </h2>
        </TabPanel>
        <TabPanel>
            <h2>Any content 2</h2>
        </TabPanel>
        <TabPanel>
            <h2>Any content 3</h2>
        </TabPanel>
        <TabPanel>
            <h2>Any content 4</h2>
        </TabPanel>
        <TabPanel>
            <h2>Any content 5</h2>
        </TabPanel>
        <TabPanel>
            <h2>Any content 🈵 </h2>
        </TabPanel>
    </Tabs>
);
