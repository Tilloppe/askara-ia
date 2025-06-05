import type { DocumentTemplate } from '../types';
import { getTemplateById, getTemplatesByTag, documentTemplates } from '../types';

class DocumentTemplateService {
  /**
   * Récupère tous les modèles de documents disponibles
   */
  static async getAllTemplates(): Promise<DocumentTemplate[]> {
    // Retourne tous les modèles de documents
    return documentTemplates;
  }

  /**
   * Récupère un modèle par son ID
   */
  static async getTemplate(templateId: string): Promise<DocumentTemplate | undefined> {
    // Dans une application réelle, cela pourrait être un appel API
    return getTemplateById(templateId);
  }

  /**
   * Filtre les modèles par tag
   */
  static async getTemplatesByTag(tag: string): Promise<DocumentTemplate[]> {
    // Dans une application réelle, cela pourrait être un appel API
    return getTemplatesByTag(tag);
  }

  /**
   * Génère un document à partir d'un modèle et de données
   */
  static generateDocument(template: DocumentTemplate, data: Record<string, string>): string {
    let content = template.content;
    
    // Remplace tous les placeholders par les valeurs fournies
    template.fields.forEach(field => {
      const placeholder = `{{${field}}}`;
      const value = data[field] || '';
      content = content.split(placeholder).join(value);
    });
    
    return content;
  }

  /**
   * Télécharge un document généré
   */
  static downloadDocument(content: string, filename: string, format: 'txt' | 'docx' = 'txt'): void {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}.${format}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
}

export default DocumentTemplateService;
