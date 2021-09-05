import { LogBuilder } from '@zougui/logger';
import { formatList } from '@zougui/utils';
import env from '@zougui/env';
import { transactionContext } from '@zougui/transaction-context';

import { Source } from './types';

const scope = env.getScope(__filename);

//#region missing inputs
export interface MissingInputsLogData {
  sources: Source[];
}

export const MissingOptionalInputsLog = new LogBuilder<MissingInputsLogData>()
  .setCode('backup.sources.inputs.optional.missing')
  .setScope(scope)
  .setTransaction(transactionContext)
  .setTopics(['backup'])
  .setMessage(({ data }) => formatList('The following optional inputs do not exist:', data.sources.flatMap(b => b.inputs)))
  .toClass();

export const MissingRequiredInputsLog = new LogBuilder<MissingInputsLogData>()
  .setCode('backup.sources.inputs.required.missing')
  .setScope(scope)
  .setTransaction(transactionContext)
  .setTopics(['backup'])
  .setMessage(({ data }) => formatList('The following required inputs do not exist:', data.sources.flatMap(b => b.inputs)))
  .toClass();
//#endregion

//#region copy inputs
export interface CopyInputData {
  source: Source;
  input: string;
}

export const CopyInput = new LogBuilder<CopyInputData>()
  .setCode('backup.sources.inputs.copy.start')
  .setScope(scope)
  .setTransaction(transactionContext)
  .setTopics(['backup', 'copy'])
  .setMessage(({ data }) => `Copying "${data.input}"...`)
  .toClass();

export const CopiedInput = new LogBuilder<CopyInputData>()
  .setCode('backup.sources.inputs.copy.success')
  .setScope(scope)
  .setTransaction(transactionContext)
  .setTopics(['backup', 'copy'])
  .setMessage(({ data }) => `Copied "${data.input}"`)
  .toClass();
//#endregion

//#region compress source
export interface CompressSourceData {
  source: Source;
}

export const CompressSource = new LogBuilder<CompressSourceData>()
  .setCode('backup.sources.compress.start')
  .setScope(scope)
  .setTransaction(transactionContext)
  .setTopics(['backup', 'compression'])
  .setMessage(({ data }) => `Compressing "${data.source.label}"...`)
  .toClass();

export const CompressedSource = new LogBuilder<CompressSourceData>()
  .setCode('backup.sources.compress.success')
  .setScope(scope)
  .setTransaction(transactionContext)
  .setTopics(['backup', 'compression'])
  .setMessage(({ data }) => `Compressed "${data.source.label}"`)
  .toClass();

//#endregion

//#region computing size
export interface ComputeInputSizeData {
  source: Source;
  input: string;
}

export const ComputingInputSize = new LogBuilder<ComputeInputSizeData>()
  .setCode('backup.sources.inputs.size.compute.start')
  .setScope(scope)
  .setTransaction(transactionContext)
  .setTopics(['backup', 'size'])
  .setMessage(({ data }) => `Computing the size of "${data.input}"`)
  .toClass();

export const ComputedInputSize = new LogBuilder<ComputeInputSizeData>()
  .setCode('backup.sources.inputs.size.compute.finish')
  .setScope(scope)
  .setTransaction(transactionContext)
  .setTopics(['backup', 'size'])
  .setMessage(({ data }) => `Computed the size of "${data.input}"`)
  .toClass();
//#endregion
