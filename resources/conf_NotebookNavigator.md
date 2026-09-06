Date d'export: [[2026-09-06]]

```json
{
  "plugin": "notebook-navigator",
  "pluginVersion": "3.3.6",
  "settings": {
    "vaultProfiles": [
      {
        "id": "default",
        "name": "Par défaut",
        "fileVisibility": "supported",
        "propertyKeys": [
          {
            "key": "statut",
            "showInNavigation": true,
            "showInList": true,
            "showInFileMenu": true
          },
          {
            "key": "type",
            "showInNavigation": true,
            "showInList": true,
            "showInFileMenu": true
          }
        ],
        "hiddenFolders": [
          "/attachments"
        ],
        "hiddenTags": [],
        "hiddenFileNames": [],
        "hiddenFileTags": [
          "archive*"
        ],
        "hiddenFileProperties": [],
        "navigationBanner": null,
        "periodicNotesFolder": "journals",
        "shortcuts": [
          {
            "type": "tag",
            "tagPath": "archived"
          },
          {
            "type": "search",
            "name": "Projets en cours",
            "query": ".type=projet AND .statut=\"3. en cours\"",
            "provider": "internal",
            "startTarget": {
              "type": "folder",
              "path": "pages"
            }
          },
          {
            "type": "folder",
            "path": "pages"
          }
        ],
        "navRainbow": {
          "mode": "foreground",
          "balanceHueLuminance": true,
          "separateThemeColors": false,
          "shortcuts": {
            "enabled": false,
            "firstColor": "#ef4444",
            "lastColor": "#8b5cf6",
            "darkFirstColor": "#ef4444",
            "darkLastColor": "#8b5cf6",
            "transitionStyle": "rgb"
          },
          "recent": {
            "enabled": true,
            "firstColor": "#ef4444",
            "lastColor": "#8b5cf6",
            "darkFirstColor": "#ef4444",
            "darkLastColor": "#8b5cf6",
            "transitionStyle": "rgb"
          },
          "folders": {
            "enabled": false,
            "firstColor": "#ef4444",
            "lastColor": "#8b5cf6",
            "darkFirstColor": "#fb7185",
            "darkLastColor": "#c084fc",
            "transitionStyle": "hue",
            "scope": "root"
          },
          "tags": {
            "enabled": false,
            "firstColor": "#ef4444",
            "lastColor": "#8b5cf6",
            "darkFirstColor": "#fb7185",
            "darkLastColor": "#c084fc",
            "transitionStyle": "hue",
            "scope": "root"
          },
          "properties": {
            "enabled": true,
            "firstColor": "#ef4444",
            "lastColor": "#8b5cf6",
            "darkFirstColor": "#fb7185",
            "darkLastColor": "#c084fc",
            "transitionStyle": "hue",
            "scope": "child"
          }
        },
        "descendantExcludedFolders": [
          "/pages/4. Archives"
        ]
      }
    ],
    "toolbarVisibility": {
      "list": {
        "groupExpansion": true
      }
    },
    "showIndentGuides": true,
    "navItemHeight": 24,
    "excludeVaultRootFromCollapse": true,
    "collapseOtherBranchesOnExpand": true,
    "enableFolderNotes": true,
    "scopeTagsToCurrentContext": true,
    "tagSortOrder": "frequency-desc",
    "scopePropertiesToCurrentContext": true,
    "includeDescendantNotes": true,
    "propertyGroupKey": "statut,type",
    "filterPinnedByFolder": true,
    "unfinishedTaskIcon": "none",
    "calendarIntegrationMode": "daily-notes",
    "calendarCustomFilePattern": "YYYY-MM-DD",
    "calendarCustomFileTemplate": "r_templates/templates/Page-Journal.md",
    "pinnedNotes": {
      "r_wiki/BOOTSTRAP.md": {
        "folder": true,
        "tag": false,
        "property": false
      },
      "bases/Recettes @ Fiches.base": {
        "folder": true,
        "tag": false,
        "property": false
      },
      "bases/Comptes @ Décomptes.base": {
        "folder": true,
        "tag": false,
        "property": false
      }
    },
    "folderAppearances": {
      "/": {
        "previewRows": 0,
        "showTags": false
      },
      "pages": {
        "previewRows": 0,
        "showTags": false,
        "groupBy": "property-follow:type"
      },
      "projets": {
        "previewRows": 0,
        "showTags": false
      },
      "r_wiki": {
        "previewRows": 0,
        "showTags": false
      },
      "r_wiki/Incidents post mortem": {
        "previewRows": 0,
        "showTags": false
      },
      "r_wiki/Projets": {
        "previewRows": 0,
        "showTags": false
      },
      "r_wiki/Projets/90-Abandonnes": {
        "previewRows": 0,
        "showTags": false
      },
      "r_wiki/Projets/90-Abandonnes/splunk-lookup-mongo-externe": {
        "previewRows": 0,
        "showTags": false
      },
      "r_wiki/Projets/90-Abandonnes/splunk-lookup-mongo-externe/livrables": {
        "previewRows": 0,
        "showTags": false
      },
      "r_wiki/Projets/90-Abandonnes/vaultwarden-remplacement-1password": {
        "previewRows": 0,
        "showTags": false
      },
      "r_wiki/Projets/90-Abandonnes/vaultwarden-remplacement-1password/etude-preliminaire": {
        "previewRows": 0,
        "showTags": false
      },
      "r_wiki/Projets/20-En-pause": {
        "previewRows": 0,
        "showTags": false
      },
      "r_wiki/Projets/20-En-pause/splunk-nettoyage-edition-fichier": {
        "previewRows": 0,
        "showTags": false
      },
      "r_wiki/Projets/30-Attente-validation": {
        "previewRows": 0,
        "showTags": false
      },
      "r_wiki/Projets/40-Attente-delai": {
        "previewRows": 0,
        "showTags": false
      },
      "r_wiki/Projets/50-Termines": {
        "previewRows": 0,
        "showTags": false
      },
      "r_wiki/Projets/50-Termines/wiki-mermaid-migration": {
        "previewRows": 0,
        "showTags": false
      },
      "r_wiki/Projets/50-Termines/wiki-concurrent-worktree": {
        "previewRows": 0,
        "showTags": false
      },
      "r_wiki/Projets/50-Termines/wiki-branche-workflow": {
        "previewRows": 0,
        "showTags": false
      },
      "r_wiki/Projets/50-Termines/webui-sessions-claude": {
        "previewRows": 0,
        "showTags": false
      },
      "r_wiki/Projets/50-Termines/vplex-bascule-prod": {
        "previewRows": 0,
        "showTags": false
      },
      "r_wiki/Projets/50-Termines/vault-dual-remote": {
        "previewRows": 0,
        "showTags": false
      },
      "r_wiki/Projets/50-Termines/update-plex-2026-09": {
        "previewRows": 0,
        "showTags": false
      },
      "r_wiki/Projets/50-Termines/splunk-lookupfile-audit": {
        "previewRows": 0,
        "showTags": false
      },
      "r_wiki/Projets/50-Termines/splunk-shc-secret-alignment": {
        "previewRows": 0,
        "showTags": false
      },
      "r_wiki/Projets/50-Termines/splunk-site-id-rename": {
        "previewRows": 0,
        "showTags": false
      },
      "r_wiki/Projets/50-Termines/splunk-site-id-rename/livrables": {
        "previewRows": 0,
        "showTags": false
      },
      "r_wiki/Projets/50-Termines/splunk-site-id-rename/livrables/run-7": {
        "previewRows": 0,
        "showTags": false
      },
      "r_wiki/Projets/50-Termines/splunk-site-id-rename/livrables/run-8": {
        "previewRows": 0,
        "showTags": false
      },
      "r_wiki/Projets/50-Termines/splunk-site-id-rename/livrables/run-5": {
        "previewRows": 0,
        "showTags": false
      },
      "r_wiki/Projets/50-Termines/splunk-site-id-rename/livrables/run-4": {
        "previewRows": 0,
        "showTags": false
      },
      "r_wiki/Projets/50-Termines/splunk-site-id-rename/livrables/run-6": {
        "previewRows": 0,
        "showTags": false
      },
      "r_wiki/Projets/50-Termines/splunk-site-id-rename/livrables/run-3": {
        "previewRows": 0,
        "showTags": false
      },
      "r_wiki/Projets/50-Termines/splunk-site-id-rename/livrables/run-2": {
        "previewRows": 0,
        "showTags": false
      },
      "r_wiki/Projets/50-Termines/splunk-site-id-rename/livrables/run-15": {
        "previewRows": 0,
        "showTags": false
      },
      "r_wiki/Projets/50-Termines/splunk-site-id-rename/livrables/run-14": {
        "previewRows": 0,
        "showTags": false
      },
      "r_wiki/Projets/50-Termines/splunk-site-id-rename/livrables/run-13": {
        "previewRows": 0,
        "showTags": false
      },
      "r_wiki/Projets/50-Termines/splunk-site-id-rename/livrables/run-12": {
        "previewRows": 0,
        "showTags": false
      },
      "r_wiki/Projets/50-Termines/splunk-site-id-rename/livrables/run-11": {
        "previewRows": 0,
        "showTags": false
      },
      "r_wiki/Projets/50-Termines/splunk-site-id-rename/livrables/run-1": {
        "previewRows": 0,
        "showTags": false
      },
      "r_wiki/Projets/50-Termines/splunk-site-id-rename/livrables/maquette-multisite": {
        "previewRows": 0,
        "showTags": false
      },
      "r_wiki/Projets/50-Termines/splunk-site-id-rename/livrables/run-10": {
        "previewRows": 0,
        "showTags": false
      },
      "r_wiki/Projets/50-Termines/splunk-sa-acl-tools-rootca": {
        "previewRows": 0,
        "showTags": false
      },
      "r_wiki/Projets/50-Termines/splunk-shc-delete-rest": {
        "previewRows": 0,
        "showTags": false
      },
      "r_wiki/Projets/50-Termines/splunk-search-performance-handbook": {
        "previewRows": 0,
        "showTags": false
      },
      "r_wiki/Projets/50-Termines/splunk-sa-acl-tools-app-acl": {
        "previewRows": 0,
        "showTags": false
      },
      "r_wiki/Projets/50-Termines/splunk-sa-acl-tools": {
        "previewRows": 0,
        "showTags": false
      },
      "r_wiki/Projets/50-Termines/splunk-rolling-restart-triggers": {
        "previewRows": 0,
        "showTags": false
      },
      "r_wiki/Projets/50-Termines/splunk-rolling-restart-triggers/livrables": {
        "previewRows": 0,
        "showTags": false
      },
      "r_wiki/Projets/50-Termines/splunk-rolling-restart-triggers/livrables/validation-ecarts": {
        "previewRows": 0,
        "showTags": false
      },
      "r_wiki/Projets/50-Termines/splunk-rolling-restart-triggers/livrables/resultats-shc": {
        "previewRows": 0,
        "showTags": false
      },
      "r_wiki/Projets/50-Termines/splunk-rolling-restart-triggers/livrables/resultats-idxc": {
        "previewRows": 0,
        "showTags": false
      },
      "r_wiki/Projets/50-Termines/splunk-rolling-restart-triggers/livrables/maquette-shc": {
        "previewRows": 0,
        "showTags": false
      },
      "r_wiki/Projets/50-Termines/splunk-rolling-restart-triggers/livrables/audit-phase4": {
        "previewRows": 0,
        "showTags": false
      },
      "r_wiki/Projets/50-Termines/splunk-rolling-restart-triggers/livrables/maquette-idxc": {
        "previewRows": 0,
        "showTags": false
      },
      "r_wiki/Projets/50-Termines/splunk-nettoyage-config-locale": {
        "previewRows": 0,
        "showTags": false
      },
      "r_wiki/Projets/50-Termines/setup-netbox-lxc": {
        "previewRows": 0,
        "showTags": false
      },
      "r_wiki/Projets/50-Termines/splunk-conf-audit": {
        "previewRows": 0,
        "showTags": false
      },
      "r_wiki/Projets/50-Termines/securisation-token-op-claude-remote": {
        "previewRows": 0,
        "showTags": false
      },
      "r_wiki/Projets/50-Termines/r_wiki": {
        "previewRows": 0,
        "showTags": false
      },
      "r_wiki/Projets/50-Termines/rotation-pat-github-livesync": {
        "previewRows": 0,
        "showTags": false
      },
      "r_wiki/Projets/50-Termines/r_knowledge_base": {
        "previewRows": 0,
        "showTags": false
      },
      "r_wiki/Projets/50-Termines/revue-documentaire-wiki-kb": {
        "previewRows": 0,
        "showTags": false
      },
      "r_wiki/Projets/50-Termines/remote-claude-mcp-profil-research": {
        "previewRows": 0,
        "showTags": false
      },
      "r_wiki/Projets/50-Termines/rename-knowledge-base-pro": {
        "previewRows": 0,
        "showTags": false
      },
      "r_wiki/Projets/50-Termines/remediation-crash-io-vnas": {
        "previewRows": 0,
        "showTags": false
      },
      "r_wiki/Projets/50-Termines/remediation-obsidian-mcp-custom": {
        "previewRows": 0,
        "showTags": false
      },
      "r_wiki/Projets/50-Termines/peuplement-knowledge-base": {
        "previewRows": 0,
        "showTags": false
      },
      "r_wiki/Projets/50-Termines/patte-dmz-vnas": {
        "previewRows": 0,
        "showTags": false
      },
      "r_wiki/Projets/50-Termines/refonte-pki-interne": {
        "previewRows": 0,
        "showTags": false
      },
      "r_wiki/Projets/50-Termines/refonte-modeles-service-doc": {
        "previewRows": 0,
        "showTags": false
      },
      "r_wiki/Projets/50-Termines/postmortem-proxmox-freeze-2026-06-09": {
        "previewRows": 0,
        "showTags": false
      },
      "r_wiki/Projets/50-Termines/outillage-maquettage-proxmox": {
        "previewRows": 0,
        "showTags": false
      },
      "r_wiki/Projets/50-Termines/obsidian-mcp-openclaw": {
        "previewRows": 0,
        "showTags": false
      },
      "r_wiki/Projets/50-Termines/obsidian-mcp-public-exposure": {
        "previewRows": 0,
        "showTags": false
      },
      "r_wiki/Projets/50-Termines/obsidian-mcp-oauth": {
        "previewRows": 0,
        "showTags": false
      },
      "r_wiki/Projets/50-Termines/obsidian-mcp": {
        "previewRows": 0,
        "showTags": false
      },
      "r_wiki/Projets/50-Termines/obsidian-mcp-log-lists": {
        "previewRows": 0,
        "showTags": false
      },
      "r_wiki/Projets/50-Termines/obsidian-mcp-garde-arborescence": {
        "previewRows": 0,
        "showTags": false
      },
      "r_wiki/Projets/50-Termines/netbox-workflow-llm": {
        "previewRows": 0,
        "showTags": false
      },
      "r_wiki/Projets/50-Termines/netbox-workflow-llm/livrables": {
        "previewRows": 0,
        "showTags": false
      },
      "r_wiki/Projets/50-Termines/kb-cheat-sheets": {
        "previewRows": 0,
        "showTags": false
      },
      "r_wiki/Projets/50-Termines/netbox-decommission": {
        "previewRows": 0,
        "showTags": false
      },
      "r_wiki/Projets/50-Termines/n8n-vdocker": {
        "previewRows": 0,
        "showTags": false
      },
      "r_wiki/Projets/50-Termines/n8n-claude-bridge": {
        "previewRows": 0,
        "showTags": false
      },
      "r_wiki/Projets/50-Termines/n8n-backup-digest": {
        "previewRows": 0,
        "showTags": false
      },
      "r_wiki/Projets/50-Termines/migration-vnas-lxc": {
        "previewRows": 0,
        "showTags": false
      },
      "r_wiki/Projets/50-Termines/migration-vnas-lxc/livrables": {
        "previewRows": 0,
        "showTags": false
      },
      "r_wiki/Projets/50-Termines/lab-hyperv-ragnarok": {
        "previewRows": 0,
        "showTags": false
      },
      "r_wiki/Projets/50-Termines/kb-cheat-sheets-complement": {
        "previewRows": 0,
        "showTags": false
      },
      "r_wiki/Projets/50-Termines/hygiene-scripts-parc": {
        "previewRows": 0,
        "showTags": false
      },
      "r_wiki/Projets/50-Termines/harmonisation-dashboards-ha": {
        "previewRows": 0,
        "showTags": false
      },
      "r_wiki/Projets/50-Termines/harmonisation-dashboards-ha/livrables": {
        "previewRows": 0,
        "showTags": false
      },
      "r_wiki/Projets/50-Termines/handbook-splunk-shc-knowledge-bundle-EN": {
        "previewRows": 0,
        "showTags": false
      },
      "r_wiki/Projets/50-Termines/handbook-splunk-shc-knowledge-bundle": {
        "previewRows": 0,
        "showTags": false
      },
      "r_wiki/Projets/50-Termines/handbook-splunk-shc-knowledge-bundle/livrables": {
        "previewRows": 0,
        "showTags": false
      },
      "r_wiki/Projets/50-Termines/durcissement-r_wiki-sync": {
        "previewRows": 0,
        "showTags": false
      },
      "r_wiki/Projets/50-Termines/durcissement-r_wiki-sync/livrables": {
        "previewRows": 0,
        "showTags": false
      },
      "r_wiki/Projets/50-Termines/handbook-splunk-shc-bundle-errata-allowSkipReplication": {
        "previewRows": 0,
        "showTags": false
      },
      "r_wiki/Projets/50-Termines/fix-starvation-remote-claude-mcp": {
        "previewRows": 0,
        "showTags": false
      },
      "r_wiki/Projets/50-Termines/fix-poller-lfc-baux-lab": {
        "previewRows": 0,
        "showTags": false
      },
      "r_wiki/Projets/50-Termines/externalisation-dns-dhcp-proxy": {
        "previewRows": 0,
        "showTags": false
      },
      "r_wiki/Projets/50-Termines/externalisation-dns-dhcp-proxy/architecture": {
        "previewRows": 0,
        "showTags": false
      },
      "r_wiki/Projets/50-Termines/doc-haproxy-pfsense": {
        "previewRows": 0,
        "showTags": false
      },
      "r_wiki/Projets/50-Termines/doc-haproxy-pfsense/livrables": {
        "previewRows": 0,
        "showTags": false
      },
      "r_wiki/Projets/50-Termines/delegation-canal-ascendant": {
        "previewRows": 0,
        "showTags": false
      },
      "r_wiki/Projets/50-Termines/delegation-parite-agents-natifs": {
        "previewRows": 0,
        "showTags": false
      },
      "r_wiki/Projets/50-Termines/delegation-agents-claude-remote": {
        "previewRows": 0,
        "showTags": false
      },
      "r_wiki/Projets/50-Termines/audit-obsidian-mcp-custom": {
        "previewRows": 0,
        "showTags": false
      },
      "r_wiki/Projets/10-En-cours": {
        "previewRows": 0,
        "showTags": false
      },
      "r_wiki/Projets/10-En-cours/migration-ntfy-prd-home": {
        "previewRows": 0,
        "showTags": false
      },
      "r_wiki/Projets/10-En-cours/splunk-shc-idx-multisite-hyperv": {
        "previewRows": 0,
        "showTags": false
      },
      "r_wiki/Projets/10-En-cours/splunk-shc-idx-multisite-hyperv/releve-l6b": {
        "previewRows": 0,
        "showTags": false
      },
      "r_wiki/Projets/10-En-cours/splunk-shc-idx-multisite-hyperv/releve-l6b/exemple-verdict": {
        "previewRows": 0,
        "showTags": false
      },
      "r_wiki/Projets/10-En-cours/splunk-shc-idx-multisite-hyperv/livrables": {
        "previewRows": 0,
        "showTags": false
      },
      "r_wiki/Projets/10-En-cours/splunk-shc-idx-multisite-hyperv/cadrage": {
        "previewRows": 0,
        "showTags": false
      },
      "r_wiki/Projets/10-En-cours/splunk-handbook": {
        "previewRows": 0,
        "showTags": false
      },
      "r_wiki/Projets/10-En-cours/splunk-dashboard-ownership": {
        "previewRows": 0,
        "showTags": false
      },
      "r_wiki/Projets/10-En-cours/splunk-dashboard-ownership/scripts": {
        "previewRows": 0,
        "showTags": false
      },
      "r_wiki/Projets/10-En-cours/splunk-dashboard-ownership/app": {
        "previewRows": 0,
        "showTags": false
      },
      "r_wiki/Projets/10-En-cours/splunk-dashboard-ownership/app/ownership_campaign": {
        "previewRows": 0,
        "showTags": false
      },
      "r_wiki/Projets/10-En-cours/splunk-dashboard-ownership/app/ownership_campaign/metadata": {
        "previewRows": 0,
        "showTags": false
      },
      "r_wiki/Projets/10-En-cours/splunk-dashboard-ownership/app/ownership_campaign/lookups": {
        "previewRows": 0,
        "showTags": false
      },
      "r_wiki/Projets/10-En-cours/splunk-dashboard-ownership/app/ownership_campaign/default": {
        "previewRows": 0,
        "showTags": false
      },
      "r_wiki/Projets/10-En-cours/splunk-dashboard-ownership/app/ownership_campaign/default/data": {
        "previewRows": 0,
        "showTags": false
      },
      "r_wiki/Projets/10-En-cours/splunk-dashboard-ownership/app/ownership_campaign/default/data/ui": {
        "previewRows": 0,
        "showTags": false
      },
      "r_wiki/Projets/10-En-cours/splunk-dashboard-ownership/app/ownership_campaign/default/data/ui/views": {
        "previewRows": 0,
        "showTags": false
      },
      "r_wiki/Projets/10-En-cours/splunk-dashboard-ownership/app/ownership_campaign/default/data/ui/nav": {
        "previewRows": 0,
        "showTags": false
      },
      "r_wiki/Projets/10-En-cours/service-discord-forum-sync": {
        "previewRows": 0,
        "showTags": false
      },
      "r_wiki/Projets/10-En-cours/gouvernance-splunk-shc-infra": {
        "previewRows": 0,
        "showTags": false
      },
      "r_wiki/Projets/10-En-cours/gouvernance-splunk-shc-infra/livrables": {
        "previewRows": 0,
        "showTags": false
      },
      "r_wiki/Projets/10-En-cours/gouvernance-splunk-shc-infra/livrables/transverse": {
        "previewRows": 0,
        "showTags": false
      },
      "r_wiki/Projets/10-En-cours/gouvernance-splunk-shc-infra/livrables/presentation": {
        "previewRows": 0,
        "showTags": false
      },
      "r_wiki/Projets/10-En-cours/gouvernance-splunk-shc-infra/livrables/maquette": {
        "previewRows": 0,
        "showTags": false
      },
      "r_wiki/Projets/10-En-cours/gouvernance-splunk-shc-infra/livrables/axe-4-wlm": {
        "previewRows": 0,
        "showTags": false
      },
      "r_wiki/Projets/10-En-cours/gouvernance-splunk-shc-infra/livrables/axe-4-wlm/maquette": {
        "previewRows": 0,
        "showTags": false
      },
      "r_wiki/Projets/10-En-cours/gouvernance-splunk-shc-infra/livrables/axe-4-wlm/maquette/indexers": {
        "previewRows": 0,
        "showTags": false
      },
      "r_wiki/Projets/10-En-cours/gouvernance-splunk-shc-infra/livrables/axe-3-sensibilisation": {
        "previewRows": 0,
        "showTags": false
      },
      "r_wiki/Projets/10-En-cours/gouvernance-splunk-shc-infra/livrables/axe-2-habilitation-saml": {
        "previewRows": 0,
        "showTags": false
      },
      "r_wiki/Projets/10-En-cours/gouvernance-splunk-shc-infra/livrables/axe-2-habilitation-saml/maquette-rbac": {
        "previewRows": 0,
        "showTags": false
      },
      "r_wiki/Projets/10-En-cours/gouvernance-splunk-shc-infra/livrables/axe-1-droits-par-defaut": {
        "previewRows": 0,
        "showTags": false
      },
      "r_wiki/Projets/10-En-cours/centralisation-monitoring-n8n": {
        "previewRows": 0,
        "showTags": false
      },
      "r_wiki/Projets/10-En-cours/centralisation-monitoring-n8n/architecture": {
        "previewRows": 0,
        "showTags": false
      },
      "r_wiki/Projets/10-En-cours/charte-dev-addon-splunk": {
        "previewRows": 0,
        "showTags": false
      },
      "r_wiki/Projets/10-En-cours/charte-dev-addon-splunk/registres": {
        "previewRows": 0,
        "showTags": false
      },
      "r_wiki/Projets/10-En-cours/audit-pfsense-dmz": {
        "previewRows": 0,
        "showTags": false
      },
      "r_wiki/Projets/10-En-cours/alarme-maison": {
        "previewRows": 0,
        "showTags": false
      },
      "r_wiki/Projets/10-En-cours/202606_polarisation_politique_française": {
        "previewRows": 0,
        "showTags": false
      },
      "r_wiki/Projets/05-Initialisation": {
        "previewRows": 0,
        "showTags": false
      },
      "r_wiki/Projets/05-Initialisation/migration-ansible-github-forgejo": {
        "previewRows": 0,
        "showTags": false
      },
      "r_wiki/Outils-Claude": {
        "previewRows": 0,
        "showTags": false
      },
      "r_wiki/Outils-Claude/skills": {
        "previewRows": 0,
        "showTags": false
      },
      "r_wiki/Outils-Claude/skills/homelab-project-coordinator": {
        "previewRows": 0,
        "showTags": false
      },
      "r_wiki/Outils-Claude/skills/homelab-project-coordinator/scripts": {
        "previewRows": 0,
        "showTags": false
      },
      "r_wiki/Documentation": {
        "previewRows": 0,
        "showTags": false
      },
      "r_wiki/Documentation/Parc Informatique": {
        "previewRows": 0,
        "showTags": false
      },
      "r_wiki/Documentation/Parc Informatique/90-Meta": {
        "previewRows": 0,
        "showTags": false
      },
      "r_wiki/Documentation/Parc Informatique/40-Pieges-connus": {
        "previewRows": 0,
        "showTags": false
      },
      "r_wiki/Documentation/Parc Informatique/50-Scripts": {
        "previewRows": 0,
        "showTags": false
      },
      "r_wiki/Documentation/Parc Informatique/50-Scripts/wiki-liens": {
        "previewRows": 0,
        "showTags": false
      },
      "r_wiki/Documentation/Parc Informatique/50-Scripts/splunk-lab": {
        "previewRows": 0,
        "showTags": false
      },
      "r_wiki/Documentation/Parc Informatique/50-Scripts/proxmox": {
        "previewRows": 0,
        "showTags": false
      },
      "r_wiki/Documentation/Parc Informatique/50-Scripts/proxmox/test": {
        "previewRows": 0,
        "showTags": false
      },
      "r_wiki/Documentation/Parc Informatique/50-Scripts/couchdb": {
        "previewRows": 0,
        "showTags": false
      },
      "r_wiki/Documentation/Parc Informatique/50-Scripts/couchdb/logrotate.d": {
        "previewRows": 0,
        "showTags": false
      },
      "r_wiki/Documentation/Parc Informatique/50-Scripts/couchdb/cron.d": {
        "previewRows": 0,
        "showTags": false
      },
      "r_wiki/Documentation/Parc Informatique/50-Scripts/obsidian-mcp": {
        "previewRows": 0,
        "showTags": false
      },
      "r_wiki/Documentation/Parc Informatique/50-Scripts/obsidian-mcp/systemd": {
        "previewRows": 0,
        "showTags": false
      },
      "r_wiki/Documentation/Parc Informatique/50-Scripts/lab-hyperv": {
        "previewRows": 0,
        "showTags": false
      },
      "r_wiki/Documentation/Parc Informatique/50-Scripts/lab-hyperv/vlab-gw": {
        "previewRows": 0,
        "showTags": false
      },
      "r_wiki/Documentation/Parc Informatique/50-Scripts/lab-hyperv/vlab-gw/files": {
        "previewRows": 0,
        "showTags": false
      },
      "r_wiki/Documentation/Parc Informatique/50-Scripts/lab-hyperv/vlab-gw/files/etc": {
        "previewRows": 0,
        "showTags": false
      },
      "r_wiki/Documentation/Parc Informatique/50-Scripts/lab-hyperv/vlab-gw/files/etc/udev": {
        "previewRows": 0,
        "showTags": false
      },
      "r_wiki/Documentation/Parc Informatique/50-Scripts/lab-hyperv/vlab-gw/files/etc/udev/rules.d": {
        "previewRows": 0,
        "showTags": false
      },
      "r_wiki/Documentation/Parc Informatique/50-Scripts/lab-hyperv/vlab-gw/files/etc/sysctl.d": {
        "previewRows": 0,
        "showTags": false
      },
      "r_wiki/Documentation/Parc Informatique/50-Scripts/lab-hyperv/vlab-gw/files/etc/network": {
        "previewRows": 0,
        "showTags": false
      },
      "r_wiki/Documentation/Parc Informatique/50-Scripts/lab-hyperv/vlab-gw/files/etc/network/interfaces.d": {
        "previewRows": 0,
        "showTags": false
      },
      "r_wiki/Documentation/Parc Informatique/50-Scripts/lab-hyperv/vlab-gw/files/etc/dnsmasq.d": {
        "previewRows": 0,
        "showTags": false
      },
      "r_wiki/Documentation/Parc Informatique/50-Scripts/lab-hyperv/tunnel-pfsense": {
        "previewRows": 0,
        "showTags": false
      },
      "r_wiki/Documentation/Parc Informatique/30-Procedures": {
        "previewRows": 0,
        "showTags": false
      },
      "r_wiki/Documentation/Parc Informatique/15-Service-Models": {
        "previewRows": 0,
        "showTags": false
      },
      "r_wiki/Documentation/Parc Informatique/20-Services": {
        "previewRows": 0,
        "showTags": false
      },
      "r_wiki/Documentation/Parc Informatique/10-Infrastructure": {
        "previewRows": 0,
        "showTags": false
      },
      "r_wiki/Documentation/Parc Informatique/10-Infrastructure/reseau": {
        "previewRows": 0,
        "showTags": false
      },
      "r_wiki/Documentation/Parc Informatique/10-Infrastructure/inventaire": {
        "previewRows": 0,
        "showTags": false
      },
      "r_wiki/Documentation/Parc Informatique/10-Infrastructure/hyperviseurs": {
        "previewRows": 0,
        "showTags": false
      },
      "r_wiki/Documentation/Parc Informatique/00-Commencer-ici": {
        "previewRows": 0,
        "showTags": false
      },
      "r_wiki/Documentation/Développement Splunk": {
        "previewRows": 0,
        "showTags": false
      },
      "r_wiki/Documentation/Développement Splunk/20-Annexes": {
        "previewRows": 0,
        "showTags": false
      },
      "r_wiki/Documentation/Développement Splunk/10-Charte": {
        "previewRows": 0,
        "showTags": false
      },
      "r_wiki/Documentation/Développement Splunk/00-Commencer-ici": {
        "previewRows": 0,
        "showTags": false
      },
      "r_wiki/Connaissances": {
        "previewRows": 0,
        "showTags": false
      },
      "r_wiki/Connaissances/Splunk": {
        "previewRows": 0,
        "showTags": false
      },
      "r_wiki/Connaissances/Politique": {
        "previewRows": 0,
        "showTags": false
      },
      "r_wiki/Connaissances/Botanique": {
        "previewRows": 0,
        "showTags": false
      },
      "r_wiki/Connaissances/Botanique/plantes": {
        "previewRows": 0,
        "showTags": false
      },
      "r_wiki/Connaissances/Botanique/lexique": {
        "previewRows": 0,
        "showTags": false
      },
      "r_templates": {
        "previewRows": 0,
        "showTags": false
      },
      "r_templates/templates": {
        "previewRows": 0,
        "showTags": false
      },
      "r_templates/scripts": {
        "previewRows": 0,
        "showTags": false
      },
      "r_templates/templater": {
        "previewRows": 0,
        "showTags": false
      },
      "r_templates/resources": {
        "previewRows": 0,
        "showTags": false
      },
      "r_templates/properties": {
        "previewRows": 0,
        "showTags": false
      },
      "r_templates/properties/type": {
        "previewRows": 0,
        "showTags": false
      },
      "r_templates/properties/statut": {
        "previewRows": 0,
        "showTags": false
      },
      "r_knowledge_base_pro": {
        "previewRows": 0,
        "showTags": false
      },
      "r_knowledge_base_pro/scripts": {
        "previewRows": 0,
        "showTags": false
      },
      "r_knowledge_base_pro/scripts/bitbucket-bulk-edit": {
        "previewRows": 0,
        "showTags": false
      },
      "r_knowledge_base_pro/methodologies": {
        "previewRows": 0,
        "showTags": false
      },
      "r_knowledge_base_pro/handbooks": {
        "previewRows": 0,
        "showTags": false
      },
      "r_knowledge_base_pro/handbooks/splunk-shc-knowledge-bundle": {
        "previewRows": 0,
        "showTags": false
      },
      "r_knowledge_base_pro/handbooks/splunk-shc-knowledge-bundle/EN": {
        "previewRows": 0,
        "showTags": false
      },
      "r_knowledge_base_pro/handbooks/splunk-user-handbook": {
        "previewRows": 0,
        "showTags": false
      },
      "r_knowledge_base_pro/handbooks/splunk-search-performance-handbook": {
        "previewRows": 0,
        "showTags": false
      },
      "r_knowledge_base_pro/handbooks/splunk-search-performance-handbook/EN": {
        "previewRows": 0,
        "showTags": false
      },
      "r_knowledge_base_pro/handbooks/splunk-exploitation-handbook": {
        "previewRows": 0,
        "showTags": false
      },
      "r_knowledge_base_pro/handbooks/gouvernance-utilisateurs-splunk": {
        "previewRows": 0,
        "showTags": false
      },
      "r_knowledge_base_pro/handbooks/gouvernance-utilisateurs-splunk/EN": {
        "previewRows": 0,
        "showTags": false
      },
      "r_knowledge_base_pro/concepts": {
        "previewRows": 0,
        "showTags": false
      },
      "r_knowledge_base_pro/concepts/PDF": {
        "previewRows": 0,
        "showTags": false
      },
      "r_knowledge_base_pro/concepts/EN": {
        "previewRows": 0,
        "showTags": false
      },
      "r_knowledge_base_pro/cheat-sheets": {
        "previewRows": 0,
        "showTags": false
      },
      "r_knowledge_base_pro/cheat-sheets/spl": {
        "previewRows": 0,
        "showTags": false
      },
      "r_knowledge_base_pro/cheat-sheets/EN": {
        "previewRows": 0,
        "showTags": false
      },
      "r_knowledge_base_pro/change-plans": {
        "previewRows": 0,
        "showTags": false
      },
      "journals": {
        "previewRows": 0,
        "showTags": false
      },
      "pages/3. Ressources": {
        "previewRows": 0,
        "showTags": false
      },
      "pages/4. Archives": {
        "previewRows": 0,
        "showTags": false
      },
      "pages/2. Domaines": {
        "previewRows": 0,
        "showTags": false
      },
      "pages/1. Projets": {
        "previewRows": 0,
        "showTags": false
      },
      "pages/1. Projets/Travaux": {
        "previewRows": 0,
        "showTags": false
      },
      "fleeting": {
        "previewRows": 0,
        "showTags": false
      },
      "briefings": {
        "previewRows": 0,
        "showTags": false
      },
      "bases": {
        "previewRows": 0,
        "showTags": false
      },
      "bases/Comptes.Decomptes": {
        "previewRows": 0,
        "showTags": false
      },
      "bases/Recettes": {
        "previewRows": 0,
        "showTags": false
      },
      "attachments": {
        "previewRows": 0,
        "showTags": false
      },
      "attachments/Ink": {
        "previewRows": 0,
        "showTags": false
      },
      "attachments/Ink/Drawing": {
        "previewRows": 0,
        "showTags": false
      }
    }
  }
}
```