import PropTypes from 'prop-types';
import FormText from './pages/form-text';
import Connect from './pages/connect';
import FormCode from './pages/form-code';
import GetStarted from './pages/get-started';
import Loader from './components/loader';
import useUserInfo from './hooks/use-user-info';
import WizardDialog from './components/wizard-dialog';
import PromptDialog from './components/prompt-dialog';
import UpgradeChip from './components/upgrade-chip';
import FormMedia from './pages/form-media';
import PromptHistory from './components/prompt-history';
import { HISTORY_TYPES } from './components/prompt-history/history-types';
import { PromptHistoryActionProvider } from './components/prompt-history/context/prompt-history-action-context';
import { PromptHistoryProvider } from './components/prompt-history/context/prompt-history-context';
import useUpgradeMessage from './hooks/use-upgrade-message';
import UsageMessages from './components/usage-messages';

const PageContent = (
	{
		type,
		controlType,
		onClose,
		onConnect,
		getControlValue,
		setControlValue,
		controlView,
		additionalOptions,
	} ) => {
	const { isLoading, isConnected, isGetStarted, connectUrl, fetchData, hasSubscription, credits, usagePercentage } = useUserInfo();
	const { showBadge } = useUpgradeMessage( { usagePercentage, hasSubscription } );
	const promptDialogStyleProps = {
		sx: {
			'& .MuiDialog-container': {
				alignItems: 'flex-start',
				mt: 'media' === type ? '2.5vh' : '18vh',
			},
			'& .MuiDialogContent-root': {
				willChange: 'height',
				transition: 'height 300ms ease-in-out',
				position: 'relative',
			},
		},
		PaperProps: {
			sx: {
				m: 0,
				maxHeight: 'media' === type ? '95vh' : '76vh',
				height: ! isLoading && 'media' === type ? '95vh' : 'auto',
			},
		},
	};

	const maybeRenderUpgradeChip = () => {
		if ( ! showBadge ) {
			return;
		}

		return (
			<UpgradeChip
				hasSubscription={ hasSubscription }
				usagePercentage={ usagePercentage }
			/>
		);
	};

	if ( isLoading ) {
		return (
			<PromptDialog onClose={ onClose } { ...promptDialogStyleProps } maxWidth={ 'media' === type ? 'lg' : 'sm' }>
				<PromptDialog.Header onClose={ onClose } />

				<PromptDialog.Content dividers>
					<Loader />
				</PromptDialog.Content>
			</PromptDialog>
		);
	}

	if ( ! isConnected ) {
		return (
			<WizardDialog onClose={ onClose }>
				<WizardDialog.Header onClose={ onClose } />

				<WizardDialog.Content dividers>
					<Connect
						connectUrl={ connectUrl }
						onSuccess={ ( data ) => {
							onConnect( data );
							fetchData();
						} }
					/>
				</WizardDialog.Content>
			</WizardDialog>
		);
	}

	if ( ! isGetStarted ) {
		return (
			<WizardDialog onClose={ onClose }>
				<WizardDialog.Header onClose={ onClose } />

				<WizardDialog.Content dividers>
					<GetStarted onSuccess={ fetchData } />
				</WizardDialog.Content>
			</WizardDialog>
		);
	}

	if ( 'media' === type ) {
		return (
			<PromptHistoryProvider historyType={ HISTORY_TYPES.IMAGE }>
				<PromptHistoryActionProvider>
					<FormMedia
						onClose={ onClose }
						getControlValue={ getControlValue }
						controlView={ controlView }
						additionalOptions={ additionalOptions }
						credits={ credits }
						maybeRenderUpgradeChip={ maybeRenderUpgradeChip }
						DialogProps={ promptDialogStyleProps }
						hasSubscription={ hasSubscription }
						usagePercentage={ usagePercentage }
					/>
				</PromptHistoryActionProvider>
			</PromptHistoryProvider>
		);
	}

	if ( 'code' === type ) {
		return (
			<PromptDialog onClose={ onClose } { ...promptDialogStyleProps }>
				<PromptHistoryProvider historyType={ HISTORY_TYPES.CODE }>
					<PromptHistoryActionProvider>
						<PromptDialog.Header onClose={ onClose }>
							<PromptHistory />

							{ maybeRenderUpgradeChip() }
						</PromptDialog.Header>

						<PromptDialog.Content className="e-ai-dialog-content" dividers>
							<FormCode
								onClose={ onClose }
								getControlValue={ getControlValue }
								setControlValue={ setControlValue }
								additionalOptions={ additionalOptions }
								credits={ credits }
								usagePercentage={ usagePercentage }
							>
								<UsageMessages
									hasSubscription={ hasSubscription }
									usagePercentage={ usagePercentage }
									sx={ { mb: 2 } }
								/>
							</FormCode>
						</PromptDialog.Content>
					</PromptHistoryActionProvider>
				</PromptHistoryProvider>
			</PromptDialog>
		);
	}

	return (
		<PromptDialog onClose={ onClose } { ...promptDialogStyleProps }>
			<PromptHistoryProvider historyType={ HISTORY_TYPES.TEXT }>
				<PromptHistoryActionProvider>
					<PromptDialog.Header onClose={ onClose }>
						<PromptHistory />

						{ maybeRenderUpgradeChip() }
					</PromptDialog.Header>

					<PromptDialog.Content className="e-ai-dialog-content" dividers>
						<FormText
							type={ type }
							controlType={ controlType }
							onClose={ onClose }
							getControlValue={ getControlValue }
							setControlValue={ setControlValue }
							additionalOptions={ additionalOptions }
							credits={ credits }
							usagePercentage={ usagePercentage }
						>
							<UsageMessages
								hasSubscription={ hasSubscription }
								usagePercentage={ usagePercentage }
								sx={ { mb: 2 } }
							/>
						</FormText>
					</PromptDialog.Content>
				</PromptHistoryActionProvider>
			</PromptHistoryProvider>
		</PromptDialog>
	);
};

PageContent.propTypes = {
	type: PropTypes.string,
	controlType: PropTypes.string,
	onClose: PropTypes.func.isRequired,
	onConnect: PropTypes.func.isRequired,
	getControlValue: PropTypes.func.isRequired,
	setControlValue: PropTypes.func.isRequired,
	additionalOptions: PropTypes.object,
	controlView: PropTypes.object,
};

export default PageContent;
