import { CatalogClient } from '@backstage/catalog-client';
import { createRouter } from '@backstage/plugin-scaffolder-backend';
import { Router } from 'express';
import type { PluginEnvironment } from '../types';
import { gitCloneAction, gitAction } from "@mdude2314/backstage-plugin-scaffolder-git-actions";
import { ScmIntegrations } from '@backstage/integration';
import { createBuiltinActions } from '@backstage/plugin-scaffolder-backend';
import { createHarnessTriggerAction } from '@internal/backstage-plugin-scaffolder-backend-module-trigger-harness-pipelines';
//import { createAwsS3CpAction, createEcrAction, createAwsSecretsManagerCreateAction } from '@roadiehq/scaffolder-backend-module-aws';
//import { fromIni } from "@aws-sdk/credential-provider";

export default async function createPlugin(
  env: PluginEnvironment,
): Promise<Router> {
  const catalogClient = new CatalogClient({
    discoveryApi: env.discovery,
  });
  const integrations = ScmIntegrations.fromConfig(env.config);
  const builtInActions = createBuiltinActions({
    catalogClient,
    integrations,
    config: env.config,
    reader: env.reader
  });
  const actions = [
    gitAction(),
    gitCloneAction(),
    //createAwsS3CpAction(),
    //createEcrAction(),
    //createAwsSecretsManagerCreateAction(),
    ...builtInActions,
    createHarnessTriggerAction(),
    //createAwsS3CpAction({credentials: fromIni({profile: "dev" })}),
    //...createBuiltinActions({
      //containerRunner,
      //integrations,
      //catalogClient,
    //})
  ];
  
  return await createRouter({
    actions,
    //containerRunner,
    catalogClient,
    logger: env.logger,
    config: env.config,
    database: env.database,
    reader: env.reader,
    identity: env.identity,
    permissions: env.permissions,
  });
}
