import { Fragment } from 'react';
import { Tabs as MuiTabs, TabsProps as MuiTabsProps, Tab as MuiTab, Paper } from '@material-ui/core';
import clsx from 'clsx';

import { useStyles } from './RenderTabs.styles';
import { useTabsContext, Tab } from '../TabsContext';

export const RenderTabs = ({ value, defaultIndex, wrapPanels, panelsWrapperProps, PanelsWrapper, unmountOnExit, ...props }: RenderTabsProps) => {
  const { state } = useTabsContext();
  const classes = useStyles();

  const defaultTabId = Object.keys(state.tabs)[defaultIndex];
  const tabs = Object.values(state.tabs).filter(tab => tab.tabTitle) as (Tab & { tabTitle: Record<string, any> })[];
  const tabsWithPanel = tabs.filter(tab => tab.tabPanel) as (Tab & { tabTitle: Record<string, any>; tabPanel: Record<string, any> })[];

  const currentValue = value ?? defaultTabId;
  const PanelsWrapperComponent = PanelsWrapper || (wrapPanels || panelsWrapperProps ? 'div' : Fragment);

  const tabsToRender = unmountOnExit
    ? tabsWithPanel.filter(tab => currentValue === tab.id)
    : tabsWithPanel;

  return (
    <>
      <MuiTabs {...props} value={currentValue}>
        {tabs.map(tab => (
          <MuiTab
            {...tab.tabTitle}
            key={tab.id}
            value={tab.id}
          />
        ))}
      </MuiTabs>

      <PanelsWrapperComponent {...(panelsWrapperProps || {})}>
        {tabsToRender.map(tab => (
          <Paper
            elevation={0}
            square
            {...tab.tabPanel}
            key={tab.id}
            className={clsx(classes.panel, tab.tabPanel.className)}
            aria-labelledby={tab.tabTitle.id}
            hidden={currentValue !== tab.id}
          >
            {tab.tabPanel.children}
          </Paper>
        ))}
      </PanelsWrapperComponent>
    </>
  )
}

export interface RenderTabsProps extends Omit<MuiTabsProps, 'onChange' | 'value'> {
  value?: string | number;
  defaultIndex: number;
  onChange?: (event: React.ChangeEvent<{}>, value: any) => void;
  wrapPanels?: boolean;
  panelsWrapperProps?: React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>;
  PanelsWrapper?: (props: Record<string, any> & PanelsWrapperProps) => JSX.Element;
  unmountOnExit?: boolean;
}

export interface PanelsWrapperProps {
  children: React.ReactNode;
}
