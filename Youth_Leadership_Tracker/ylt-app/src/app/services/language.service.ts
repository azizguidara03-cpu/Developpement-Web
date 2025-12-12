import { Injectable, signal, WritableSignal, computed, effect } from '@angular/core';

export type Language = 'en' | 'fr' | 'es';

export interface TranslationDictionary {
  [key: string]: {
    en: string;
    fr: string;
    es: string;
  };
}

export const TRANSLATIONS: TranslationDictionary = {
  // App Titles
  'app_title': { en: 'Youth Leadership Tracker', fr: 'Suivi du Leadership des Jeunes', es: 'Rastreador de Liderazgo Juvenil' },
  'dashboard': { en: 'Dashboard', fr: 'Tableau de Bord', es: 'Tablero' },
  'members': { en: 'Members', fr: 'Membres', es: 'Miembros' },
  'experiences': { en: 'Experiences', fr: 'Expériences', es: 'Experiencias' },
  'profile': { en: 'Profile', fr: 'Profil', es: 'Perfil' },
  'achievements': { en: 'Achievements', fr: 'Réalisations', es: 'Logros' },
  'earned': { en: 'Earned', fr: 'Gagné', es: 'Ganado' },

  // Common UI Actions
  'search': { en: 'Search', fr: 'Rechercher', es: 'Buscar' },
  'edit': { en: 'Edit', fr: 'Modifier', es: 'Editar' },
  'delete': { en: 'Delete', fr: 'Supprimer', es: 'Eliminar' },
  'save': { en: 'Save', fr: 'Enregistrer', es: 'Guardar' },
  'cancel': { en: 'Cancel', fr: 'Annuler', es: 'Cancelar' },
  'role': { en: 'Role', fr: 'Rôle', es: 'Rol' },
  'status': { en: 'Status', fr: 'Statut', es: 'Estado' },
  'department': { en: 'Department', fr: 'Département', es: 'Departamento' },
  'description': { en: 'Description', fr: 'Description', es: 'Descripción' },
  'start_date': { en: 'Start Date', fr: 'Date de Début', es: 'Fecha de Inicio' },
  'end_date': { en: 'End Date', fr: 'Date de Fin', es: 'Fecha de Fin' },
  'name': { en: 'Name', fr: 'Nom', es: 'Nombre' },
  'email': { en: 'Email', fr: 'Email', es: 'Correo' },
  'age': { en: 'Age', fr: 'Âge', es: 'Edad' },
  'member': { en: 'Member', fr: 'Membre', es: 'Miembro' },
  
  // Dashboard Stats
  'leadership_score': { en: 'Leadership Score', fr: 'Score de Leadership', es: 'Puntaje de Liderazgo' },
  'experiences_count': { en: 'Experiences', fr: 'Expériences', es: 'Experiencias' },
  'active': { en: 'Active', fr: 'Actif', es: 'Activo' },
  'completed': { en: 'Completed', fr: 'Terminé', es: 'Completado' },
  'upcoming': { en: 'Upcoming', fr: 'À venir', es: 'Próximo' },
  'avg_duration': { en: 'Average Duration', fr: 'Durée Moyenne', es: 'Duración Promedio' },
  'average_duration': { en: 'Average Duration', fr: 'Durée Moyenne', es: 'Duración Promedio' },
  'most_common_role': { en: 'Most Common Role', fr: 'Rôle le plus fréquent', es: 'Rol más común' },
  'top_dept': { en: 'Top Department', fr: 'Département Principal', es: 'Departamento Principal' },
  'days': { en: 'days', fr: 'jours', es: 'días' },
  'per_leadership_experience': { en: 'per leadership experience', fr: 'par expérience de leadership', es: 'por experiencia de liderazgo' },
  'top_leadership_position': { en: 'top leadership position', fr: 'poste de direction principal', es: 'posición de liderazgo principal' },
  'no_badges_yet': { en: 'No badges earned yet. Start completing experiences!', fr: 'Aucun badge gagné pour l\'instant. Commencez à acquérir de l\'expérience !', es: '¡Aún no has ganado insignias. ¡Empieza a completar experiencias!' },
  'role_diversity': { en: 'Role Diversity', fr: 'Diversité des Rôles', es: 'Diversidad de Roles' },
  'skills': { en: 'Skills', fr: 'Compétences', es: 'Habilidades' },
  'total_points': { en: 'Total Points', fr: 'Points Totaux', es: 'Puntos Totales' },
  'dashboard_subtitle': { en: 'Track your leadership journey and achievements', fr: 'Suivez votre parcours de leadership et vos réalisations', es: 'Sigue tu trayectoria de liderazgo y logros' },
  'organization_overview': { en: 'Organization Overview', fr: 'Aperçu de l\'Organisation', es: 'Resumen de la Organización' },
  'org_overview_subtitle': { en: 'General statistics for all members and experiences', fr: 'Statistiques générales pour tous les membres et expériences', es: 'Estadísticas generales de todos los miembros y experiencias' },
  
  // Leadership Levels & Messages
  'level_emerging': { en: 'Emerging Leader', fr: 'Leader Émergent', es: 'Líder Emergente' },
  'msg_emerging': { en: 'is just starting their leadership journey. Keep growing!', fr: 'commence tout juste son parcours de leadership. Continuez à grandir !', es: 'está comenzando su viaje de liderazgo. ¡Sigue creciendo!' },
  'level_developing': { en: 'Developing Leader', fr: 'Leader en Développement', es: 'Líder en Desarrollo' },
  'msg_developing': { en: 'is making great progress on their leadership path!', fr: 'fait de grands progrès sur sa voie de leadership !', es: '¡está progresando mucho en su camino de liderazgo!' },
  'level_established': { en: 'Established Leader', fr: 'Leader Confirmé', es: 'Líder Establecido' },
  'msg_established': { en: 'has developed strong leadership capabilities!', fr: 'a développé de solides capacités de leadership !', es: '¡ha desarrollado fuertes capacidades de liderazgo!' },
  'level_senior': { en: 'Senior Leader', fr: 'Leader Senior', es: 'Líder Senior' },
  'msg_senior': { en: 'is an experienced leader with diverse skills!', fr: 'est un leader expérimenté aux compétences diversifiées !', es: '¡es un líder experimentado con diversas habilidades!' },

  // Skills (for checkboxes and display)
  'Teamwork': { en: 'Teamwork', fr: 'Travail d\'Équipe', es: 'Trabajo en Equipo' },
  'Communication': { en: 'Communication', fr: 'Communication', es: 'Comunicación' },
  'Leadership': { en: 'Leadership', fr: 'Leadership', es: 'Liderazgo' },
  'Adaptability': { en: 'Adaptability', fr: 'Adaptabilité', es: 'Adaptabilidad' },
  'Problem Solving': { en: 'Problem Solving', fr: 'Résolution de Problèmes', es: 'Resolución de Problemas' },
  'Time Management': { en: 'Time Management', fr: 'Gestion du Temps', es: 'Gestión del Tiempo' },
  'Creativity': { en: 'Creativity', fr: 'Créativité', es: 'Creatividad' },
  'Project Management': { en: 'Project Management', fr: 'Gestion de Projet', es: 'Gestión de Proyectos' },
  'Decision Making': { en: 'Decision Making', fr: 'Prise de Décision', es: 'Toma de Decisiones' },
  'Strategic Thinking': { en: 'Strategic Thinking', fr: 'Pensée Stratégique', es: 'Pensamiento Estratégico' },

  // Departments (full names for dropdowns and display)
  'Talent Management': { en: 'Talent Management', fr: 'Gestion des Talents', es: 'Gestión de Talento' },
  'Finance': { en: 'Finance', fr: 'Finance', es: 'Finanzas' },
  'Business Development': { en: 'Business Development', fr: 'Développement Commercial', es: 'Desarrollo de Negocios' },
  'Marketing': { en: 'Marketing', fr: 'Marketing', es: 'Marketing' },
  'Information Management': { en: 'Information Management', fr: 'Gestion de l\'Information', es: 'Gestión de Información' },
  'Operations': { en: 'Operations', fr: 'Opérations', es: 'Operaciones' },
  'Partnership Development': { en: 'Partnership Development', fr: 'Développement de Partenariats', es: 'Desarrollo de Asociaciones' },
  'IGV': { en: 'IGV', fr: 'IGV', es: 'IGV' },
  'IGT': { en: 'IGT', fr: 'IGT', es: 'IGT' },
  'OGV': { en: 'OGV', fr: 'OGV', es: 'OGV' },
  'OGT': { en: 'OGT', fr: 'OGT', es: 'OGT' },

  // Roles
  'Team Leader': { en: 'Team Leader', fr: 'Chef d\'Équipe', es: 'Líder de Equipo' },
  'Team Member': { en: 'Team Member', fr: 'Membre d\'Équipe', es: 'Miembro del Equipo' },
  'Vice President': { en: 'Vice President', fr: 'Vice-Président', es: 'Vicepresidente' },
  'President': { en: 'President', fr: 'Président', es: 'Presidente' },
  'Organizational Committee': { en: 'Organizational Committee', fr: 'Comité Organisationnel', es: 'Comité Organizacional' },
  'Exchange Participant': { en: 'Exchange Participant', fr: 'Participant à l\'Échange', es: 'Participante de Intercambio' },
  'sort_by': { en: 'Sort By', fr: 'Trier par', es: 'Ordenar por' },
  'all_departments': { en: 'All Departments', fr: 'Tous les Départements', es: 'Todos los Departamentos' },
  'all_roles': { en: 'All Roles', fr: 'Tous les Rôles', es: 'Todos los Roles' },
  'all_status': { en: 'All Status', fr: 'Tous les Statuts', es: 'Todos los Estados' },
  'showing': { en: 'Showing', fr: 'Affichage de', es: 'Mostrando' },
  'of': { en: 'of', fr: 'sur', es: 'de' },
  'no_members_found': { en: 'No members found', fr: 'Aucun membre trouvé', es: 'No se encontraron miembros' },
  'no_experiences_found': { en: 'No experiences found', fr: 'Aucune expérience trouvée', es: 'No se encontraron experiencias' },
  'try_adjusting': { en: 'Try adjusting your search or filters', fr: 'Essayez d\'ajuster votre recherche ou vos filtres', es: 'Intente ajustar su búsqueda o filtros' },
  'create_first_member': { en: 'Create First Member', fr: 'Créer le Premier Membre', es: 'Crear Primer Miembro' },
  'create_first_experience': { en: 'Create First Experience', fr: 'Créer la Première Expérience', es: 'Crear Primera Experiencia' },
  'members_management': { en: 'Members Management', fr: 'Gestion des Membres', es: 'Gestión de Miembros' },
  'manage_members_desc': { en: 'Manage your AIESEC local committee members', fr: 'Gérez les membres de votre comité local AIESEC', es: 'Administra los miembros de tu comité local de AIESEC' },
  'leadership_experiences': { en: 'Leadership Experiences', fr: 'Expériences de Leadership', es: 'Experiencias de Liderazgo' },
  'manage_experiences_desc': { en: 'Manage member leadership experiences and roles', fr: 'Gérer les expériences de leadership et les rôles des membres', es: 'Administrar experiencias de liderazgo y roles de miembros' },
  'previous': { en: 'Previous', fr: 'Précédent', es: 'Anterior' },
  'next': { en: 'Next', fr: 'Suivant', es: 'Siguiente' },
  'latest_first': { en: 'Latest First', fr: 'Le plus récent d\'abord', es: 'Más recientes primero' },
  'search_placeholder_members': { en: 'Search by name, email...', fr: 'Rechercher par nom, email...', es: 'Buscar por nombre, correo...' },
  'search_placeholder_experiences': { en: 'Search by role, member...', fr: 'Rechercher par rôle, membre...', es: 'Buscar por rol, miembro...' },

  // Common Actions
  'view_details': { en: 'View Details', fr: 'Voir Détails', es: 'Ver Detalles' },
  'back': { en: 'Back', fr: 'Retour', es: 'Volver' },
  'add_experience': { en: 'Add Experience', fr: 'Ajouter Expérience', es: 'Añadir Experiencia' },
  'add_member': { en: 'Add Member', fr: 'Ajouter Membre', es: 'Añadir Miembro' },
  'current': { en: 'Current', fr: 'En cours', es: 'Actual' },
  'skills_gained': { en: 'Skills Gained', fr: 'Compétences Acquises', es: 'Habilidades Adquiridas' },
  'months': { en: 'months', fr: 'mois', es: 'meses' },
  'member_info': { en: 'Member Information', fr: 'Informations du Membre', es: 'Información del Miembro' },
  'full_name': { en: 'Full Name', fr: 'Nom Complet', es: 'Nombre Completo' },
  'created': { en: 'Created', fr: 'Créé', es: 'Creado' },
  'last_updated': { en: 'Last Updated', fr: 'Dernière Modification', es: 'Última Actualización' },
  'experience_details': { en: 'Experience Details', fr: 'Détails de l\'Expérience', es: 'Detalles de la Experiencia' },
  'TM': { en: 'TM', fr: 'TM', es: 'TM' },
  'Team Management': { en: 'Team Management', fr: 'Gestion d\'Équipe', es: 'Gestión de Equipo' },
  
  // Roles
  'team_member': { en: 'Team Member', fr: 'Membre d\'Équipe', es: 'Miembro del Equipo' },
  'team_leader': { en: 'Team Leader', fr: 'Chef d\'Équipe', es: 'Líder de Equipo' },
  'vice_president': { en: 'Vice President', fr: 'Vice-Président', es: 'Vicepresidente' },
  'local_committee_president': { en: 'Local Committee President', fr: 'Président du Comité Local', es: 'Presidente del Comité Local' },
  'oc_member': { en: 'OC Member', fr: 'Membre du CO', es: 'Miembro del CO' },
  'oc_vice_president': { en: 'OC Vice President', fr: 'Vice-Président du CO', es: 'Vicepresidente del CO' },
  'oc_president': { en: 'OC President', fr: 'Président du CO', es: 'Presidente del CO' },
  'local_support_team': { en: 'Local Support Team', fr: 'Équipe de Support Local', es: 'Equipo de Soporte Local' },
  'entity_support_team': { en: 'Entity Support Team', fr: 'Équipe de Support Entité', es: 'Equipo de Soporte de Entidad' },
  
  // Forms & Dialogs
  'edit_member': { en: 'Edit Member', fr: 'Modifier le Membre', es: 'Editar Miembro' },
  'create_member': { en: 'Create Member', fr: 'Créer le Membre', es: 'Crear Miembro' },
  'create_new_member': { en: 'Create New Member', fr: 'Créer Nouveau Membre', es: 'Crear Nuevo Miembro' },
  'update_member_info': { en: 'Update member information', fr: 'Mettre à jour les informations du membre', es: 'Actualizar información del miembro' },
  'add_new_member_desc': { en: 'Add a new member to your committee', fr: 'Ajouter un nouveau membre à votre comité', es: 'Añadir un nuevo miembro a su comité' },
  'edit_experience': { en: 'Edit Experience', fr: 'Modifier l\'Expérience', es: 'Editar Experiencia' },
  'create_new_experience': { en: 'Create New Experience', fr: 'Créer Nouvelle Expérience', es: 'Crear Nueva Experiencia' },
  'update_experience_desc': { en: 'Update experience details', fr: 'Mettre à jour les détails de l\'expérience', es: 'Actualizar detalles de la experiencia' },
  'add_new_experience_desc': { en: 'Add a new leadership experience', fr: 'Ajouter une nouvelle expérience de leadership', es: 'Añadir una nueva experiencia de liderazgo' },
  'back_to_members': { en: 'Back to Members', fr: 'Retour aux Membres', es: 'Volver a Miembros' },
  'back_to_experiences': { en: 'Back to Experiences', fr: 'Retour aux Expériences', es: 'Volver a Experiencias' },
  'optional': { en: 'Optional', fr: 'Optionnel', es: 'Opcional' },
  'system_role': { en: 'System Role', fr: 'Rôle Système', es: 'Rol del Sistema' },
  'user_account_access': { en: 'User Account Access', fr: 'Accès au Compte Utilisateur', es: 'Acceso a Cuenta de Usuario' },
  'manage_access': { en: 'Manage Access', fr: 'Gérer l\'Accès', es: 'Gestionar Acceso' },
  'login_password': { en: 'Login Password', fr: 'Mot de Passe de Connexion', es: 'Contraseña de Inicio de Sesión' },
  'leave_blank_password': { en: 'Leave blank to keep current password', fr: 'Laisser vide pour conserver le mot de passe actuel', es: 'Dejar en blanco para mantener la contraseña actual' },
  'set_login_password': { en: 'Set login password', fr: 'Définir le mot de passe de connexion', es: 'Establecer contraseña de inicio de sesión' },
  'select_department': { en: 'Select Department', fr: 'Sélectionner le Département', es: 'Seleccionar Departamento' },
  'select_role': { en: 'Select Role', fr: 'Sélectionner le Rôle', es: 'Seleccionar Rol' },
  'select_member': { en: 'Select Member', fr: 'Sélectionner le Membre', es: 'Seleccionar Miembro' },
  'enter_full_name': { en: 'Enter full name', fr: 'Entrez le nom complet', es: 'Ingrese nombre completo' },
  'email_placeholder': { en: 'your.email@aiesec.org', fr: 'votre.email@aiesec.org', es: 'tu.email@aiesec.org' },
  'describe_experience_en': { en: 'Describe the experience in English...', fr: 'Décrivez l\'expérience en anglais...', es: 'Describa la experiencia en inglés...' },
  'describe_experience_fr': { en: 'Description (French)', fr: 'Description (Français)', es: 'Descripción (Francés)' },
  'describe_experience_fr_placeholder': { en: 'Describe the experience in French...', fr: 'Décrivez l\'expérience en français...', es: 'Describa la experiencia en francés...' },
  'describe_experience_es': { en: 'Description (Spanish)', fr: 'Description (Espagnol)', es: 'Descripción (Español)' },
  'describe_experience_es_placeholder': { en: 'Describe the experience in Spanish...', fr: 'Décrivez l\'expérience en espagnol...', es: 'Describa la experiencia en español...' },
  'end_date_optional': { en: 'End Date (Optional - leave empty for ongoing)', fr: 'Date de Fin (Optionnel - laisser vide si en cours)', es: 'Fecha de Fin (Opcional - dejar vacío si está en curso)' },
  'processing': { en: 'Processing...', fr: 'Traitement...', es: 'Procesando...' },
  'required_field': { en: 'is required', fr: 'est requis', es: 'es requerido' },
  'valid_email_required': { en: 'Valid email is required', fr: 'Un email valide est requis', es: 'Se requiere un email válido' },
  'password_min_chars': { en: 'Password (min 6 chars) is required for new accounts', fr: 'Le mot de passe (min 6 caractères) est requis pour les nouveaux comptes', es: 'La contraseña (mín 6 caracteres) es obligatoria para cuentas nuevas' },
  'select_at_least_one_skill': { en: 'Select at least one skill', fr: 'Sélectionnez au moins une compétence', es: 'Seleccione al menos una habilidad' },
  'determine_access': { en: 'Determines what they can access in the system', fr: 'Détermine ce à quoi ils peuvent accéder dans le système', es: 'Determina a qué pueden acceder en el sistema' },

  // Dashboard Misc
  'leadership_growth': { en: 'Leadership Growth', fr: 'Croissance du Leadership', es: 'Crecimiento del Liderazgo' },
  'activity_timeline': { en: 'Activity Timeline', fr: 'Chronologie des Activités', es: 'Cronograma de Actividades' },
  'top_5_skills': { en: 'Top 5 Skills', fr: 'Top 5 Compétences', es: 'Top 5 Habilidades' },
  'most_represented': { en: 'most represented', fr: 'le plus représenté', es: 'más representado' },
  
  // Footer
  'about': { en: 'About', fr: 'À Propos', es: 'Acerca de' },
  'app_description': { en: 'Youth Leadership Tracker - AIESEC Local Committee Management System', fr: 'Suivi du Leadership des Jeunes - Système de Gestion du Comité Local AIESEC', es: 'Rastreador de Liderazgo Juvenil - Sistema de Gestión del Comité Local de AIESEC' },
  'features': { en: 'Features', fr: 'Fonctionnalités', es: 'Características' },
  'support': { en: 'Support', fr: 'Support', es: 'Soporte' },
  'documentation': { en: 'Documentation', fr: 'Documentation', es: 'Documentación' },
  'contact': { en: 'Contact', fr: 'Contact', es: 'Contacto' },
  'faq': { en: 'FAQ', fr: 'FAQ', es: 'Preguntas Frecuentes' },
  'version': { en: 'Version', fr: 'Version', es: 'Versión' },
  'rights_reserved': { en: 'All rights reserved.', fr: 'Tous droits réservés.', es: 'Todos los derechos reservados.' },
  
  // Profile
  'user_profile': { en: 'User Profile', fr: 'Profil Utilisateur', es: 'Perfil de Usuario' },
  'manage_account_info': { en: 'Manage your account information', fr: 'Gérez vos informations de compte', es: 'Administra la información de tu cuenta' },
  'account_information': { en: 'Account Information', fr: 'Informations du Compte', es: 'Información de la Cuenta' },
  'bio': { en: 'Bio', fr: 'Biographie', es: 'Biografía' },
  'bio_placeholder': { en: 'Add a short bio about yourself...', fr: 'Ajoutez une courte biographie sur vous-même...', es: 'Añade una breve biografía sobre ti...' },
  'edit_profile': { en: 'Edit Profile', fr: 'Modifier Profil', es: 'Editar Perfil' },
  'save_changes': { en: 'Save Changes', fr: 'Enregistrer Changements', es: 'Guardar Cambios' },
  'saving': { en: 'Saving...', fr: 'Enregistrement...', es: 'Guardando...' },
  'profile_updated_success': { en: 'Profile updated successfully!', fr: 'Profil mis à jour avec succès !', es: '¡Perfil actualizado con éxito!' },
  'role_immutable': { en: 'Role cannot be changed from profile', fr: 'Le rôle ne peut pas être modifié depuis le profil', es: 'El rol no se puede cambiar desde el perfil' },
  'security': { en: 'Security', fr: 'Sécurité', es: 'Seguridad' },
  'password': { en: 'Password', fr: 'Mot de passe', es: 'Contraseña' },
  'password_last_changed': { en: 'Last changed 3 months ago', fr: 'Dernière modification il y a 3 mois', es: 'Último cambio hace 3 meses' },
  'change_password': { en: 'Change Password', fr: 'Changer Mot de Passe', es: 'Cambiar Contraseña' },
  'two_factor_auth': { en: 'Two-Factor Authentication', fr: 'Authentification à Deux Facteurs', es: 'Autenticación de Dos Factores' },
  'not_enabled': { en: 'Not enabled', fr: 'Non activé', es: 'No habilitado' },
  'enable': { en: 'Enable', fr: 'Activer', es: 'Habilitar' },
  'not_logged_in': { en: 'Not logged in', fr: 'Non connecté', es: 'No conectado' },
  'login_prompt': { en: 'Please log in to view your profile.', fr: 'Veuillez vous connecter pour voir votre profil.', es: 'Inicie sesión para ver su perfil.' },
  'go_to_login': { en: 'Go to Login', fr: 'Aller à la Connexion', es: 'Ir al Inicio de Sesión' },
  'view_statistics_desc': { en: 'View statistics and analytics', fr: 'Voir statistiques et analyses', es: 'Ver estadísticas y análisis' },
  'sign_out_desc': { en: 'Sign out from your account', fr: 'Déconnectez-vous de votre compte', es: 'Cerrar sesión de su cuenta' },
  'logout': { en: 'Logout', fr: 'Déconnexion', es: 'Cerrar sesión' },

  // Badges (Labels for badges can be keys like 'badge_new_starter')
  'New Starter': { en: 'New Starter', fr: 'Nouveau Débutant', es: 'Nuevo Comienzo' },
  'Experience Novice': { en: 'Experience Novice', fr: 'Novice en Expérience', es: 'Novato en Experiencia' },
  'Experience Veteran': { en: 'Experience Veteran', fr: 'Vétéran de l\'Expérience', es: 'Veterano en Experiencia' },
  'Skill Collector': { en: 'Skill Collector', fr: 'Collectionneur de Compétences', es: 'Coleccionista de Habilidades' },
  'Role Diver': { en: 'Role Diver', fr: 'Explorateur de Rôles', es: 'Explorador de Roles' },
  'Department Pro': { en: 'Department Pro', fr: 'Pro du Département', es: 'Pro del Departamento' },
  'Loyalist': { en: 'Loyalist', fr: 'Loyaliste', es: 'Lealista' },

  // Member Detail Page
  'member_details': { en: 'Member Details', fr: 'Détails du Membre', es: 'Detalles del Miembro' },
  'member_not_found': { en: 'Member not found', fr: 'Membre introuvable', es: 'Miembro no encontrado' },
  'member_not_found_desc': { en: 'The member you\'re looking for doesn\'t exist.', fr: 'Le membre que vous recherchez n\'existe pas.', es: 'El miembro que buscas no existe.' },
  'joined': { en: 'Joined', fr: 'Inscrit le', es: 'Se unió' },
  'years_old': { en: 'years old', fr: 'ans', es: 'años' },
  'no_experiences_yet': { en: 'No experiences yet', fr: 'Aucune expérience pour l\'instant', es: 'Sin experiencias todavía' },
  'ongoing': { en: 'Ongoing', fr: 'En cours', es: 'En curso' },
  'view': { en: 'View', fr: 'Voir', es: 'Ver' },
  'confirm_delete_member': { en: 'Are you sure you want to delete this member? This action cannot be undone.', fr: 'Êtes-vous sûr de vouloir supprimer ce membre ? Cette action est irréversible.', es: '¿Estás seguro de que deseas eliminar este miembro? Esta acción no se puede deshacer.' },
  'update_experience': { en: 'Update Experience', fr: 'Mettre à jour l\'Expérience', es: 'Actualizar Experiencia' },
  'create_experience': { en: 'Create Experience', fr: 'Créer Expérience', es: 'Crear Experiencia' },

  // Experience Detail Page
  'experience_not_found': { en: 'Experience not found', fr: 'Expérience introuvable', es: 'Experiencia no encontrada' },
  'experience_not_found_desc': { en: 'The experience you\'re looking for doesn\'t exist.', fr: 'L\'expérience que vous recherchez n\'existe pas.', es: 'La experiencia que buscas no existe.' },
  'confirm_delete_experience': { en: 'Are you sure you want to delete this experience? This action cannot be undone.', fr: 'Êtes-vous sûr de vouloir supprimer cette expérience ? Cette action est irréversible.', es: '¿Estás seguro de que deseas eliminar esta experiencia? Esta acción no se puede deshacer.' },

  // Contact Page
  'contact_us': { en: 'Contact Us', fr: 'Nous Contacter', es: 'Contáctenos' },
  'get_in_touch': { en: 'Get in touch with the YLT team', fr: 'Entrez en contact avec l\'équipe YLT', es: 'Ponte en contacto con el equipo YLT' },
  'contact_information': { en: 'Contact Information', fr: 'Informations de Contact', es: 'Información de Contacto' },
  'phone': { en: 'Phone', fr: 'Téléphone', es: 'Teléfono' },
  'office_location': { en: 'Office Location', fr: 'Emplacement du Bureau', es: 'Ubicación de la Oficina' },
  'office_hours': { en: 'Office Hours', fr: 'Heures d\'Ouverture', es: 'Horario de Oficina' },
  'follow_us': { en: 'Follow Us', fr: 'Suivez-nous', es: 'Síguenos' },
  'send_us_message': { en: 'Send Us a Message', fr: 'Envoyez-nous un Message', es: 'Envíenos un Mensaje' },
  'your_name': { en: 'Your name', fr: 'Votre nom', es: 'Tu nombre' },
  'subject': { en: 'Subject', fr: 'Sujet', es: 'Asunto' },
  'message_subject': { en: 'Message subject', fr: 'Sujet du message', es: 'Asunto del mensaje' },
  'message': { en: 'Message', fr: 'Message', es: 'Mensaje' },
  'your_message_here': { en: 'Your message here...', fr: 'Votre message ici...', es: 'Tu mensaje aquí...' },
  'send_message': { en: 'Send Message', fr: 'Envoyer le Message', es: 'Enviar Mensaje' },
  'we_will_get_back': { en: 'We\'ll get back to you as soon as possible', fr: 'Nous vous répondrons dès que possible', es: 'Le responderemos lo antes posible' },

  // Documentation Page
  'documentation_title': { en: 'Documentation', fr: 'Documentation', es: 'Documentación' },
  'ylt_user_guide': { en: 'YLT User Guide', fr: 'Guide Utilisateur YLT', es: 'Guía del Usuario YLT' },
  'getting_started': { en: 'Getting Started', fr: 'Premiers Pas', es: 'Empezando' },
  'quick_start': { en: 'Quick Start', fr: 'Démarrage Rapide', es: 'Inicio Rápido' },
  'managing_members': { en: 'Managing Members', fr: 'Gestion des Membres', es: 'Gestión de Miembros' },
  'tracking_experiences': { en: 'Tracking Experiences', fr: 'Suivi des Expériences', es: 'Seguimiento de Experiencias' },
  'understanding_dashboard': { en: 'Understanding the Dashboard', fr: 'Comprendre le Tableau de Bord', es: 'Entendiendo el Tablero' },

  // FAQ Page
  'faq_title': { en: 'Frequently Asked Questions', fr: 'Questions Fréquentes', es: 'Preguntas Frecuentes' },
  'faq_find_answers': { en: 'Find answers to the most common questions about YLT', fr: 'Trouvez des réponses aux questions les plus courantes sur YLT', es: 'Encuentra respuestas a las preguntas más comunes sobre YLT' },

  // Dashboard Additional
  'members_by_dept': { en: 'Members by Dept', fr: 'Membres par Dept', es: 'Miembros por Depto' },
  'experiences_by_role': { en: 'Experiences by Role', fr: 'Expériences par Rôle', es: 'Experiencias por Rol' },
  'view_all_experiences': { en: 'View all experiences', fr: 'Voir toutes les expériences', es: 'Ver todas las experiencias' },
  'manage_committee_members': { en: 'Manage committee members', fr: 'Gérer les membres du comité', es: 'Gestionar miembros del comité' },
  'track_leadership_journeys': { en: 'Track leadership journeys', fr: 'Suivre les parcours de leadership', es: 'Seguir trayectorias de liderazgo' },
  'your_personal_settings': { en: 'Your personal settings', fr: 'Vos paramètres personnels', es: 'Tu configuración personal' },
  'loading_dashboard': { en: 'Loading dashboard...', fr: 'Chargement du tableau de bord...', es: 'Cargando tablero...' },

  // FAQ Questions & Answers
  'faq_q1': { en: 'What is Youth Leadership Tracker?', fr: 'Qu\'est-ce que Youth Leadership Tracker ?', es: '¿Qué es Youth Leadership Tracker?' },
  'faq_a1': { en: 'Youth Leadership Tracker (YLT) is a comprehensive management system designed for AIESEC local committees. It helps track members, their leadership experiences, skills development, and provides analytics on committee performance.', fr: 'Youth Leadership Tracker (YLT) est un système de gestion complet conçu pour les comités locaux AIESEC. Il permet de suivre les membres, leurs expériences de leadership, le développement des compétences et fournit des analyses sur les performances du comité.', es: 'Youth Leadership Tracker (YLT) es un sistema de gestión integral diseñado para los comités locales de AIESEC. Ayuda a rastrear miembros, sus experiencias de liderazgo, desarrollo de habilidades y proporciona análisis sobre el rendimiento del comité.' },
  'faq_q2': { en: 'How do I create a new member?', fr: 'Comment créer un nouveau membre ?', es: '¿Cómo creo un nuevo miembro?' },
  'faq_a2_intro': { en: 'To create a new member:', fr: 'Pour créer un nouveau membre :', es: 'Para crear un nuevo miembro:' },
  'faq_a2_step1': { en: 'Go to the Members section', fr: 'Allez dans la section Membres', es: 'Ve a la sección Miembros' },
  'faq_a2_step2': { en: 'Click the "Create Member" button', fr: 'Cliquez sur le bouton "Créer Membre"', es: 'Haz clic en el botón "Crear Miembro"' },
  'faq_a2_step3': { en: 'Fill in the member details (name, email, department, age, skills)', fr: 'Remplissez les détails du membre (nom, email, département, âge, compétences)', es: 'Rellena los detalles del miembro (nombre, email, departamento, edad, habilidades)' },
  'faq_a2_step4': { en: 'Click "Create" to save', fr: 'Cliquez sur "Créer" pour enregistrer', es: 'Haz clic en "Crear" para guardar' },
  'faq_q3': { en: 'How do I track an experience?', fr: 'Comment suivre une expérience ?', es: '¿Cómo rastreo una experiencia?' },
  'faq_a3_intro': { en: 'To track a leadership experience:', fr: 'Pour suivre une expérience de leadership :', es: 'Para rastrear una experiencia de liderazgo:' },
  'faq_a3_step1': { en: 'Navigate to Experiences section', fr: 'Naviguez vers la section Expériences', es: 'Navega a la sección Experiencias' },
  'faq_a3_step2': { en: 'Click "Create Experience"', fr: 'Cliquez sur "Créer Expérience"', es: 'Haz clic en "Crear Experiencia"' },
  'faq_a3_step3': { en: 'Select the member and role', fr: 'Sélectionnez le membre et le rôle', es: 'Selecciona el miembro y el rol' },
  'faq_a3_step4': { en: 'Add dates, description, and skills gained', fr: 'Ajoutez les dates, la description et les compétences acquises', es: 'Añade fechas, descripción y habilidades adquiridas' },
  'faq_a3_step5': { en: 'Save the experience', fr: 'Enregistrez l\'expérience', es: 'Guarda la experiencia' },
  'faq_q4': { en: 'Can I search for specific members?', fr: 'Puis-je rechercher des membres spécifiques ?', es: '¿Puedo buscar miembros específicos?' },
  'faq_a4': { en: 'Yes! The Members section has a powerful search feature. You can search by member name, email address, or department. You can also filter by department and sort by various criteria.', fr: 'Oui ! La section Membres dispose d\'une fonction de recherche puissante. Vous pouvez rechercher par nom de membre, adresse email ou département. Vous pouvez également filtrer par département et trier selon divers critères.', es: '¡Sí! La sección Miembros tiene una función de búsqueda potente. Puedes buscar por nombre de miembro, dirección de email o departamento. También puedes filtrar por departamento y ordenar por varios criterios.' },
  'faq_q5': { en: 'What does the Dashboard show?', fr: 'Que montre le Tableau de Bord ?', es: '¿Qué muestra el Tablero?' },
  'faq_a5': { en: 'The Dashboard displays: Total members and experiences count, Active and completed experiences, Top skills in your committee, Member and role distribution, and Quick action buttons for common tasks.', fr: 'Le Tableau de Bord affiche : Le nombre total de membres et d\'expériences, Les expériences actives et terminées, Les principales compétences de votre comité, La répartition des membres et des rôles, et Les boutons d\'action rapide pour les tâches courantes.', es: 'El Tablero muestra: Recuento total de miembros y experiencias, Experiencias activas y completadas, Principales habilidades en tu comité, Distribución de miembros y roles, y Botones de acción rápida para tareas comunes.' },
  'still_have_questions': { en: 'Still have questions?', fr: 'Vous avez encore des questions ?', es: '¿Aún tienes preguntas?' },
  'faq_contact_prompt': { en: 'If you couldn\'t find the answer you\'re looking for, don\'t hesitate to contact us.', fr: 'Si vous n\'avez pas trouvé la réponse que vous cherchez, n\'hésitez pas à nous contacter.', es: 'Si no encontraste la respuesta que buscas, no dudes en contactarnos.' },

  // Documentation Page
  'doc_getting_started': { en: 'Getting Started', fr: 'Premiers Pas', es: 'Empezando' },
  'doc_login': { en: 'Login: Use your AIESEC email and password to access the system', fr: 'Connexion : Utilisez votre email et mot de passe AIESEC pour accéder au système', es: 'Inicio de sesión: Usa tu email y contraseña de AIESEC para acceder al sistema' },
  'doc_dashboard_desc': { en: 'Dashboard: View your statistics and quick actions on the main dashboard', fr: 'Tableau de Bord : Consultez vos statistiques et actions rapides sur le tableau de bord principal', es: 'Tablero: Visualiza tus estadísticas y acciones rápidas en el tablero principal' },
  'doc_members_desc': { en: 'Members: Manage all committee members and their information', fr: 'Membres : Gérez tous les membres du comité et leurs informations', es: 'Miembros: Administra todos los miembros del comité y su información' },
  'doc_experiences_desc': { en: 'Experiences: Track leadership experiences and development', fr: 'Expériences : Suivez les expériences de leadership et le développement', es: 'Experiencias: Rastrea experiencias de liderazgo y desarrollo' },
  'doc_profile_desc': { en: 'Profile: Update your personal profile and settings', fr: 'Profil : Mettez à jour votre profil personnel et vos paramètres', es: 'Perfil: Actualiza tu perfil personal y configuración' },
  'doc_members_management': { en: 'Members Management', fr: 'Gestion des Membres', es: 'Gestión de Miembros' },
  'doc_view_members': { en: 'View Members: See all committee members in a paginated list', fr: 'Voir les Membres : Consultez tous les membres du comité dans une liste paginée', es: 'Ver Miembros: Consulta todos los miembros del comité en una lista paginada' },
  'doc_search': { en: 'Search: Find members by name, email, or department', fr: 'Rechercher : Trouvez des membres par nom, email ou département', es: 'Buscar: Encuentra miembros por nombre, email o departamento' },
  'doc_filter': { en: 'Filter: Filter members by department (IGV, IGT, OGV, OGT, etc.)', fr: 'Filtrer : Filtrez les membres par département (IGV, IGT, OGV, OGT, etc.)', es: 'Filtrar: Filtra miembros por departamento (IGV, IGT, OGV, OGT, etc.)' },
  'doc_sort': { en: 'Sort: Sort by name, email, department, or join date', fr: 'Trier : Triez par nom, email, département ou date d\'inscription', es: 'Ordenar: Ordena por nombre, email, departamento o fecha de ingreso' },
  'doc_create': { en: 'Create: Add new members with skills and department assignment', fr: 'Créer : Ajoutez de nouveaux membres avec compétences et affectation de département', es: 'Crear: Añade nuevos miembros con habilidades y asignación de departamento' },
  'doc_edit_member': { en: 'Edit: Update member information', fr: 'Modifier : Mettez à jour les informations du membre', es: 'Editar: Actualiza la información del miembro' },
  'doc_delete': { en: 'Delete: Remove members from the system', fr: 'Supprimer : Retirez des membres du système', es: 'Eliminar: Elimina miembros del sistema' },
  'doc_experiences_tracking': { en: 'Experiences Tracking', fr: 'Suivi des Expériences', es: 'Seguimiento de Experiencias' },
  'doc_analytics': { en: 'Analytics Dashboard', fr: 'Tableau de Bord Analytique', es: 'Tablero de Análisis' },
  'doc_tips': { en: 'Tips & Best Practices', fr: 'Conseils & Bonnes Pratiques', es: 'Consejos y Mejores Prácticas' },

  // Documentation - Experiences Tracking Content
  'doc_view_experiences': { en: 'View Experiences: See all leadership experiences in the system', fr: 'Voir les Expériences : Consultez toutes les expériences de leadership dans le système', es: 'Ver Experiencias: Consulta todas las experiencias de liderazgo en el sistema' },
  'doc_track_progress': { en: 'Track Progress: Monitor active, completed, and upcoming experiences', fr: 'Suivre les Progrès : Surveillez les expériences actives, terminées et à venir', es: 'Seguir Progreso: Monitorea experiencias activas, completadas y próximas' },
  'doc_advanced_filters': { en: 'Advanced Filters: Filter by role, department, status, and member', fr: 'Filtres Avancés : Filtrez par rôle, département, statut et membre', es: 'Filtros Avanzados: Filtra por rol, departamento, estado y miembro' },
  'doc_skills_gained': { en: 'Skills Gained: Record and track skills learned from each experience', fr: 'Compétences Acquises : Enregistrez et suivez les compétences apprises de chaque expérience', es: 'Habilidades Adquiridas: Registra y rastrea habilidades aprendidas de cada experiencia' },
  'doc_duration_tracking': { en: 'Duration Tracking: Automatically calculate experience duration', fr: 'Suivi de Durée : Calcul automatique de la durée de l\'expérience', es: 'Seguimiento de Duración: Cálculo automático de duración de experiencia' },
  'doc_create_experience': { en: 'Create Experience: Add new leadership experiences with dates and details', fr: 'Créer Expérience : Ajoutez de nouvelles expériences de leadership avec dates et détails', es: 'Crear Experiencia: Añade nuevas experiencias de liderazgo con fechas y detalles' },
  'doc_status_badges': { en: 'Status Badges: Visual indicators for experience status (Active/Completed/Upcoming)', fr: 'Badges de Statut : Indicateurs visuels pour le statut de l\'expérience (Actif/Terminé/À venir)', es: 'Insignias de Estado: Indicadores visuales para estado de experiencia (Activo/Completado/Próximo)' },

  // Documentation - Analytics Dashboard Content
  'doc_key_metrics': { en: 'Key Metrics: View total members, experiences, and completion rates', fr: 'Métriques Clés : Consultez le nombre total de membres, d\'expériences et les taux d\'achèvement', es: 'Métricas Clave: Visualiza total de miembros, experiencias y tasas de finalización' },
  'doc_top_skills': { en: 'Top Skills: See most developed skills across the committee', fr: 'Top Compétences : Consultez les compétences les plus développées du comité', es: 'Top Habilidades: Consulta las habilidades más desarrolladas del comité' },
  'doc_dept_distribution': { en: 'Department Distribution: Visualize member distribution by department', fr: 'Distribution par Département : Visualisez la répartition des membres par département', es: 'Distribución por Departamento: Visualiza la distribución de miembros por departamento' },
  'doc_role_analysis': { en: 'Role Analysis: Understand experience distribution by role', fr: 'Analyse des Rôles : Comprenez la répartition des expériences par rôle', es: 'Análisis de Roles: Comprende la distribución de experiencias por rol' },
  'doc_quick_actions': { en: 'Quick Actions: Fast access to common tasks and operations', fr: 'Actions Rapides : Accès rapide aux tâches et opérations courantes', es: 'Acciones Rápidas: Acceso rápido a tareas y operaciones comunes' },

  // Documentation - Tips Content
  'doc_tip1': { en: 'Use the search feature to quickly find members or experiences', fr: 'Utilisez la fonction de recherche pour trouver rapidement des membres ou des expériences', es: 'Usa la función de búsqueda para encontrar rápidamente miembros o experiencias' },
  'doc_tip2': { en: 'Regularly update member skills to reflect their development', fr: 'Mettez régulièrement à jour les compétences des membres pour refléter leur développement', es: 'Actualiza regularmente las habilidades de los miembros para reflejar su desarrollo' },
  'doc_tip3': { en: 'Track all leadership experiences for proper evaluation', fr: 'Suivez toutes les expériences de leadership pour une évaluation appropriée', es: 'Rastrea todas las experiencias de liderazgo para una evaluación adecuada' },
  'doc_tip4': { en: 'Use filters to narrow down results and find what you need', fr: 'Utilisez les filtres pour affiner les résultats et trouver ce dont vous avez besoin', es: 'Usa filtros para reducir resultados y encontrar lo que necesitas' },
  'doc_tip5': { en: 'Check the dashboard regularly for team statistics', fr: 'Consultez régulièrement le tableau de bord pour les statistiques de l\'équipe', es: 'Revisa el tablero regularmente para las estadísticas del equipo' },
  'doc_tip6': { en: 'Keep member information up-to-date', fr: 'Gardez les informations des membres à jour', es: 'Mantén la información de los miembros actualizada' },

  // FAQ Q6-Q12
  'faq_q6': { en: 'How do I update my profile?', fr: 'Comment mettre à jour mon profil ?', es: '¿Cómo actualizo mi perfil?' },
  'faq_a6_intro': { en: 'To update your profile:', fr: 'Pour mettre à jour votre profil :', es: 'Para actualizar tu perfil:' },
  'faq_a6_step1': { en: 'Click on the "Profile" link in the navigation', fr: 'Cliquez sur le lien "Profil" dans la navigation', es: 'Haz clic en el enlace "Perfil" en la navegación' },
  'faq_a6_step2': { en: 'Click the "Edit" button', fr: 'Cliquez sur le bouton "Modifier"', es: 'Haz clic en el botón "Editar"' },
  'faq_a6_step3': { en: 'Update your information', fr: 'Mettez à jour vos informations', es: 'Actualiza tu información' },
  'faq_a6_step4': { en: 'Click "Save" to confirm changes', fr: 'Cliquez sur "Enregistrer" pour confirmer les modifications', es: 'Haz clic en "Guardar" para confirmar los cambios' },
  'faq_q7': { en: 'Is my data saved automatically?', fr: 'Mes données sont-elles enregistrées automatiquement ?', es: '¿Se guardan mis datos automáticamente?' },
  'faq_a7': { en: 'Yes! All data is automatically saved to your browser\'s storage. Your data persists even if you close the browser and reopen the application, as long as you don\'t clear your browser\'s local storage.', fr: 'Oui ! Toutes les données sont automatiquement enregistrées dans le stockage de votre navigateur. Vos données persistent même si vous fermez le navigateur et rouvrez l\'application, tant que vous ne videz pas le stockage local de votre navigateur.', es: '¡Sí! Todos los datos se guardan automáticamente en el almacenamiento de tu navegador. Tus datos persisten incluso si cierras el navegador y reabres la aplicación, siempre que no borres el almacenamiento local de tu navegador.' },
  'faq_q8': { en: 'Can I delete a member or experience?', fr: 'Puis-je supprimer un membre ou une expérience ?', es: '¿Puedo eliminar un miembro o una experiencia?' },
  'faq_a8': { en: 'Yes! You can delete members and experiences (if you have admin access). Simply go to the Members or Experiences section, find the item you want to delete, click the delete button, and confirm the action. Note: Deleted items cannot be recovered.', fr: 'Oui ! Vous pouvez supprimer des membres et des expériences (si vous avez un accès administrateur). Allez simplement dans la section Membres ou Expériences, trouvez l\'élément que vous souhaitez supprimer, cliquez sur le bouton de suppression et confirmez l\'action. Note : Les éléments supprimés ne peuvent pas être récupérés.', es: '¡Sí! Puedes eliminar miembros y experiencias (si tienes acceso de administrador). Simplemente ve a la sección Miembros o Experiencias, encuentra el elemento que deseas eliminar, haz clic en el botón eliminar y confirma la acción. Nota: Los elementos eliminados no se pueden recuperar.' },
  'faq_q9': { en: 'What departments are supported?', fr: 'Quels départements sont pris en charge ?', es: '¿Qué departamentos están soportados?' },
  'faq_a9': { en: 'YLT supports the following departments: IGV (Incoming Global Volunteer), IGT (Incoming Global Talent), OGV (Outgoing Global Volunteer), OGT (Outgoing Global Talent), Talent Management, Finance, Business Development, Marketing, Information Management.', fr: 'YLT prend en charge les départements suivants : IGV (Volontaire Mondial Entrant), IGT (Talent Mondial Entrant), OGV (Volontaire Mondial Sortant), OGT (Talent Mondial Sortant), Gestion des Talents, Finance, Développement Commercial, Marketing, Gestion de l\'Information.', es: 'YLT soporta los siguientes departamentos: IGV (Voluntario Global Entrante), IGT (Talento Global Entrante), OGV (Voluntario Global Saliente), OGT (Talento Global Saliente), Gestión de Talento, Finanzas, Desarrollo de Negocios, Marketing, Gestión de Información.' },
  'faq_q10': { en: 'What should I do if I forgot my password?', fr: 'Que faire si j\'ai oublié mon mot de passe ?', es: '¿Qué debo hacer si olvidé mi contraseña?' },
  'faq_a10': { en: 'Currently, YLT uses a demo authentication system. The default demo credentials are: Email: admin@aiesec.org (Admin), ahmed@aiesec.org (VP), fatima@aiesec.org (TL), ali@aiesec.org (Member). Password: password123', fr: 'Actuellement, YLT utilise un système d\'authentification de démonstration. Les identifiants de démonstration par défaut sont : Email : admin@aiesec.org (Admin), ahmed@aiesec.org (VP), fatima@aiesec.org (TL), ali@aiesec.org (Membre). Mot de passe : password123', es: 'Actualmente, YLT usa un sistema de autenticación de demostración. Las credenciales de demo predeterminadas son: Email: admin@aiesec.org (Admin), ahmed@aiesec.org (VP), fatima@aiesec.org (TL), ali@aiesec.org (Miembro). Contraseña: password123' },
  'faq_q11': { en: 'How are experiences marked as completed?', fr: 'Comment les expériences sont-elles marquées comme terminées ?', es: '¿Cómo se marcan las experiencias como completadas?' },
  'faq_a11': { en: 'Experiences are automatically marked based on their end date: Active (end date is in the future), Completed (end date has passed), Upcoming (start date is in the future).', fr: 'Les expériences sont automatiquement marquées en fonction de leur date de fin : Actif (la date de fin est dans le futur), Terminé (la date de fin est passée), À venir (la date de début est dans le futur).', es: 'Las experiencias se marcan automáticamente según su fecha de fin: Activo (la fecha de fin está en el futuro), Completado (la fecha de fin ha pasado), Próximo (la fecha de inicio está en el futuro).' },
  'faq_q12': { en: 'What user roles exist in the system?', fr: 'Quels rôles utilisateur existent dans le système ?', es: '¿Qué roles de usuario existen en el sistema?' },
  'faq_a12': { en: 'YLT has 4 user roles with different permissions: Admin (full access to all features), VP (can view all, edit experiences), TL (can view all, edit experiences), Member (view-only access).', fr: 'YLT a 4 rôles utilisateur avec des permissions différentes : Admin (accès complet à toutes les fonctionnalités), VP (peut tout voir, modifier les expériences), TL (peut tout voir, modifier les expériences), Membre (accès en lecture seule).', es: 'YLT tiene 4 roles de usuario con diferentes permisos: Admin (acceso completo a todas las funciones), VP (puede ver todo, editar experiencias), TL (puede ver todo, editar experiencias), Miembro (acceso de solo lectura).' }
};

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  private readonly STORAGE_KEY = 'ylt_language';
  
  currentLang = signal<Language>('en');

  constructor() {
    const savedLang = localStorage.getItem(this.STORAGE_KEY) as Language;
    if (savedLang && ['en', 'fr', 'es'].includes(savedLang)) {
      this.currentLang.set(savedLang);
    }
  }

  setLanguage(lang: Language) {
    this.currentLang.set(lang);
    localStorage.setItem(this.STORAGE_KEY, lang);
  }

  translate(key: string): string {
    const lang = this.currentLang();
    const entry = TRANSLATIONS[key];
    if (entry) {
      return entry[lang] || entry['en'] || key;
    }
    return key;
  }
}
